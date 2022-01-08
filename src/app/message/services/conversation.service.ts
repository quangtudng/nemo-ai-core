import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Message } from "../index.entity";
import { MessageRepository } from "../index.repository";
import { WebhookDto } from "../dto/conversation";
import { CustomerService } from "@app/customer/index.service";
import { CONVERSATION_STAGE, MESSAGE_OWNER } from "../constants/conversation";
import {
  getRandomMessage,
  NEMO_ASK,
  NEMO_PROMPT,
  NLP_ENTITY,
  NLP_INTENT,
  SPECIAL_COMMAND,
} from "../constants/message";
import { Customer } from "@app/customer/index.entity";
import { NlpService } from "@app/nlp/index.service";
import { EmailUtil } from "@core/utils/email";
import { LocationService } from "@app/location/index.service";
import { Location } from "@app/location/index.entity";
import { ProjectLogger } from "@core/utils/loggers/log-service";
import { EntityUtil } from "../utils/entity";
import { CovidUtil } from "@core/utils/covid";
import { LocationUtil } from "@core/utils/location";
import { Category } from "@app/category/index.entity";
import { Service } from "@app/service/index.entity";
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
    const customer = await this.customerService.findOneOrFail({
      longId: dto.customerLongId,
    });

    await this.customerService.updateOne(customer.id, {
      viewed: 0,
    });
    const customerMessage = await this.repo.createOne({
      body: dto.body,
      owner: MESSAGE_OWNER.CUSTOMER,
      customer,
    });
    const nemoMessages = await this._processNextAnswer(dto.body, customer);

    return {
      messages: [customerMessage].concat(nemoMessages),
      customer,
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
    if (customer.currentStage === CONVERSATION_STAGE.INTRODUCTION) {
      nemoResponses = await this._introductionHandler(body, customer);
    }
    if (customer.currentStage === CONVERSATION_STAGE.CAPTURING) {
      if (body === SPECIAL_COMMAND.HELP) {
        nemoResponses.push(getRandomMessage(NEMO_ASK.HELP));
      } else {
        nemoResponses = await this._capturingHandler(body);
      }
    }
    const messages = nemoResponses.map((nemoResponse) => {
      return this.repo.create({
        body: nemoResponse,
        owner: MESSAGE_OWNER.NEMO,
        customer,
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
    const nlpResult = await this.nlpService.parse(body);
    const entities = nlpResult.entities;
    const allLocations = await this._getLocationFromEntities(entities);
    if (nlpResult.intent?.name === NLP_INTENT.ASKING_INFO) {
      if (EntityUtil.hasCovidEntity(entities)) {
        if (allLocations.length > 0) {
          responses = await this._getLocationCovidData(allLocations);
        } else {
          responses.push(getRandomMessage(NEMO_PROMPT.LOCATION_FAILED));
        }
      } else if (EntityUtil.hasServiceEntity(entities)) {
        // TODO: Implement and improve service searching
        // const allCategories = await this._getCategoryFromEntities(entities);
        // if (allCategories.length > 0) {
        //   const categoryIds = allCategories.map((cat) => cat.id);
        //   const services = await this.serviceService.findServiceByCategoryIds(
        //     categoryIds,
        //   );
        //   console.log(services);
        // } else {
        //   const allServices = await this._getServiceFromEntities(entities);
        //   console.log(allServices);
        // }
      } else if (EntityUtil.hasLocationEntity(entities)) {
        responses = await this._getAllLocationInfo(allLocations);
      }
    }
    if (responses.length === 0) {
      responses.push(getRandomMessage(NEMO_PROMPT.NOT_UNDERSTAND));
    }
    console.log(responses);
    return responses;
  }

  private async _getLocationFromEntities(entities: any[]): Promise<Location[]> {
    /**
     * Try to extract locations from entities collected by Rasa
     */
    const allLocations = [];
    try {
      const locationEntities = entities
        .filter((entity) => entity.name === NLP_ENTITY.LOCATION)
        .map((entity) => entity.value);
      for (let i = 0; i < locationEntities.length; i++) {
        const loc = await this.locationService.findNodeByName(
          locationEntities[i],
        );
        allLocations.push(loc);
      }
      return allLocations.flat(2);
    } catch (error) {
      ProjectLogger.exception(error);
      return allLocations;
    }
  }
  private async _getLocationCovidData(locations: Location[]) {
    const responses = [];
    try {
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        const covidData = await CovidUtil.getCovidStatisticByName(loc.name);
        if (covidData) {
          const haveNoCovidData =
            !covidData.death &&
            !covidData.treating &&
            !covidData.cases &&
            !covidData.recovered &&
            !covidData.casesToday;
          if (haveNoCovidData) {
            responses.push(getRandomMessage(NEMO_PROMPT.COVID_FAILED));
          } else {
            const covidText =
              `Hiện tại, số liệu covid-19 tại địa điểm du lịch ${LocationUtil.getTypeName(
                loc.type,
              )} ${loc.name}:` +
              "\n• Tử vong: " +
              covidData.death +
              "\n• Đang chữa trị: " +
              covidData.treating +
              "\n• Ca nhiễm: " +
              covidData.cases +
              "\n• Hồi phục: " +
              covidData.recovered +
              "\n• Ca mới: " +
              covidData.casesToday;
            responses.push(covidText);
          }
        }
      }
      return responses;
    } catch (error) {
      ProjectLogger.exception(error);
      return responses;
    }
  }
  private async _getCategoryFromEntities(entities: any[]): Promise<Category[]> {
    let categories = [];
    try {
      const categoryEntities = entities
        .filter((entity) => entity.name === NLP_ENTITY.SERVICE)
        .map((entity) => entity.value);
      for (let i = 0; i < categoryEntities.length; i++) {
        const catName = categoryEntities[i];
        const resultCat = await this.categoryService.findCategoriesByName(
          catName,
        );
        categories.push(resultCat);
      }
      categories = categories.flat(2);
      return categories;
    } catch (error) {
      ProjectLogger.exception(error);
      return categories;
    }
  }
  private async _getServiceFromEntities(entities: any[]): Promise<Service[]> {
    return null;
  }
  private async _getAllLocationInfo(locations: Location[]) {
    const responses = [];
    try {
      const ids = locations.map((location) => location.id);
      for (let i = 0; i < ids.length; i++) {
        const loc = await this.locationService.findNode(ids[i]);
        if (loc.description) {
          responses.push(loc.description);
        }
        if (loc.categoryCount && loc.categoryCount.length > 0) {
          let serviceText = `Hiện tại trong hệ thống của Nemo, ở ${LocationUtil.getTypeName(
            loc.type,
          )} ${loc.name} có: \n`;
          loc.categoryCount.forEach((category, index) => {
            serviceText += `• ${category.count} ${category.category_title}`;
            if (index !== loc.categoryCount.length - 1) {
              serviceText += "\n";
            }
          });
          responses.push(serviceText);
        }
      }
      return responses;
    } catch (error) {
      ProjectLogger.exception(error);
      return responses;
    }
  }
}
