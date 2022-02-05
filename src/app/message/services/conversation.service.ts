import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Message } from "../index.entity";
import { MessageRepository } from "../index.repository";
import { WebhookDto } from "../dto/conversation";
import { CustomerService } from "@app/customer/index.service";
import {
  CONVERSATION_STAGE,
  MESSAGE_OWNER,
  QUESTION_TYPE,
} from "../constants/conversation";
import {
  getRandomMessage,
  NEMO_ASK,
  NEMO_PROMPT,
  NLP_INTENT,
  SPECIAL_COMMAND,
} from "../constants/message";
import { Customer } from "@app/customer/index.entity";
import { NlpService } from "@app/nlp/index.service";
import { EmailUtil } from "@core/utils/email";
import { LocationService } from "@app/location/index.service";
import { EntityUtil } from "../utils/entity";
import { CategoryService } from "@app/category/index.service";
import { ServiceService } from "@app/service/index.service";

@Injectable()
export class ConversationService extends BaseCrudService<Message> {
  constructor(
    private repo: MessageRepository,
    private customerService: CustomerService,
    private nlpService: NlpService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private serviceService: ServiceService,
  ) {
    super(repo);
  }

  async startNewConversation() {
    /**
     * Start a new conversation, return new customer and new welcome messages
     */
    const newCustomer = await this.customerService.createNewCustomer();
    const nemoMessages = await this._getNewConversationMessage(newCustomer);
    return {
      messages: nemoMessages,
      customer: newCustomer,
    };
  }

  async continueConversation(dto: WebhookDto) {
    /**
     * Continue an ongoing conversation, return new message and current customer
     */
    const currentCustomer = await this.customerService.findOneOrFail({
      longId: dto.customerLongId,
    });

    await this.customerService.updateOne(currentCustomer.id, {
      viewed: 0,
    });
    const customerMessage = await this.repo.createOne({
      body: dto.body,
      owner: MESSAGE_OWNER.CUSTOMER,
      customer: currentCustomer,
    });

    const nemoMessages = await this._processNextAnswer(
      dto.body,
      currentCustomer,
    );

    return {
      messages: [customerMessage].concat(nemoMessages),
      customer: currentCustomer,
    };
  }

  private async _getNewConversationMessage(newCustomer: Customer) {
    const introductionMessage = await this.repo.createOne({
      body: getRandomMessage(NEMO_ASK.START_CONVERSATION),
      owner: MESSAGE_OWNER.NEMO,
      customer: newCustomer,
    });
    const contactMessage = await this.repo.createOne({
      body: getRandomMessage(NEMO_ASK.EMAIL),
      owner: MESSAGE_OWNER.NEMO,
      customer: newCustomer,
    });
    return [introductionMessage, contactMessage];
  }

  private async _processNextAnswer(body: string, customer: Customer) {
    let nemoResponses = [];
    let extraData = [];
    let interestResults = null;
    let type = QUESTION_TYPE.FREE_TEXT;

    if (customer.currentStage === CONVERSATION_STAGE.INTRODUCTION) {
      nemoResponses = await this._introductionHandler(body, customer);
    }
    if (customer.currentStage === CONVERSATION_STAGE.CAPTURING) {
      if (body === SPECIAL_COMMAND.HELP) {
        nemoResponses.push(getRandomMessage(NEMO_ASK.HELP));
      } else {
        const fullData = await this._capturingHandler(body);
        nemoResponses = fullData.responses;
        extraData = fullData.extraData;
        type = fullData.type;
      }
    }

    if (extraData.length > 0) {
      interestResults = JSON.stringify(extraData);
    }
    const messages = nemoResponses.map((nemoResponse) => {
      return this.repo.create({
        body: nemoResponse,
        owner: MESSAGE_OWNER.NEMO,
        customer,
        interestResults,
        type,
      });
    });
    return this.repo.save(messages);
  }

  private async _introductionHandler(body: string, customer: Customer) {
    /**
     * 1. If the customer provides the email, try to extract it and save it down
     * 2. If the customer chooses to skip, go on to the capturing phase
     * 3. If the customer fails to provide the email and skip, continue asking them about it.
     */
    const response = [];
    const email = EmailUtil.extractFromText(body);
    if (email || body.includes(SPECIAL_COMMAND.SKIP)) {
      response.push(getRandomMessage(NEMO_ASK.HELP));
      await this.customerService.updateOne(customer.id, {
        email,
        currentStage: CONVERSATION_STAGE.CAPTURING,
      });
    } else {
      response.push(getRandomMessage(NEMO_PROMPT.EMAIL_FAILED));
    }
    return response;
  }
  private async _capturingHandler(body: string) {
    /**
     * 1. Customer asks for covid information
     * 2. Customer asks for location information
     * 3. Customer asks for service information
     */
    let responses = [];
    let type = QUESTION_TYPE.FREE_TEXT;
    let extraData = [];

    const nlpResult = await this.nlpService.parse(body);
    const isAskingInfo = nlpResult.intent?.name === NLP_INTENT.ASKING_INFO;
    if (isAskingInfo) {
      const isAskingCovid = EntityUtil.hasCovidEntity(nlpResult.entities);
      const isAskingService = EntityUtil.hasServiceEntity(nlpResult.entities);
      const isAskingLocation = EntityUtil.hasLocationEntity(nlpResult.entities);
      const isAskingWeather = EntityUtil.hasWeatherEntity(nlpResult.entities);
      if (isAskingWeather) {
        const fullData = await this._processWeatherResponse(nlpResult.entities);
        responses = fullData.responses;
        extraData = fullData.extraData;
        type = QUESTION_TYPE.WEATHER_TEXT;
      } else if (isAskingCovid) {
        responses = await this._processCovidResponse(nlpResult.entities);
      } else if (isAskingService) {
        const fullData = await this._processServiceResponse(nlpResult.entities);
        responses = fullData.responses;
        extraData = fullData.extraData;
        type = QUESTION_TYPE.RESULT_TEXT;
      } else if (isAskingLocation) {
        responses = await this._processLocationResponse(nlpResult.entities);
      }
    }
    if (responses.length === 0) {
      responses.push(getRandomMessage(NEMO_PROMPT.NOT_UNDERSTAND));
    }
    return {
      responses,
      extraData,
      type,
    };
  }

  private async _processWeatherResponse(entities: any) {
    const responses = [];
    let extraData = [];
    const allLocations = await this.locationService.getLocationFromEntities(
      entities,
    );
    if (allLocations.length > 0) {
      extraData = allLocations.map((location) => location.id);
      responses.push(
        `Cảm ơn bạn, Nemo dã tìm thấy thông tin thời tiết tại địa điểm bạn tìm kiếm`,
      );
    } else {
      //TODO: Improve response
      responses.push(getRandomMessage(NEMO_PROMPT.LOCATION_FAILED));
    }
    return {
      responses,
      extraData,
    };
  }

  private async _processCovidResponse(entities: any) {
    let responses = [];
    const allLocations = await this.locationService.getLocationFromEntities(
      entities,
    );
    if (allLocations.length > 0) {
      responses = await this.locationService.getLocationCovidData(allLocations);
    } else {
      //TODO: Improve response
      responses.push(getRandomMessage(NEMO_PROMPT.LOCATION_FAILED));
    }
    return responses;
  }

  private async _processServiceResponse(entities: any) {
    const responses = [];
    let extraData = [];
    // TODO: Implement alias here
    const allCategories = await this.categoryService.getCategoryFromEntities(
      entities,
    );
    if (allCategories.length > 0) {
      const allLocations = await this.locationService.getLocationFromEntities(
        entities,
        true,
      );
      const categoryIds = allCategories.map((cat) => cat.id);
      const locationIds = allLocations.map((loc) => loc.id);
      const foundServices = await this.serviceService.findByCategoryAndLocation(
        categoryIds,
        locationIds,
      );
      extraData = foundServices.map((service) => service.id);
      responses.push(
        `Cảm ơn bạn, Nemo đã tìm thấy ${extraData.length} địa điểm du lịch khớp với kết quả của bạn`,
      );
    }
    return {
      responses,
      extraData,
    };
  }

  private async _processLocationResponse(entities: any) {
    let responses = [];
    const allLocations = await this.locationService.getLocationFromEntities(
      entities,
    );
    if (allLocations.length > 0) {
      responses = await this.locationService.getAllLocationInfo(allLocations);
    } else {
      //TODO: Improve response
      responses.push(getRandomMessage(NEMO_PROMPT.LOCATION_FAILED));
    }
    return responses;
  }
}
