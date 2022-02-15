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
  NLP_ENTITY,
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
import { ProjectLogger } from "@core/utils/loggers/log-service";

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
    // Mark as unread
    await this.customerService.updateOne(currentCustomer.id, {
      viewed: 0,
    });
    // Save customer's message
    const customerMessage = await this.repo.createOne({
      body: dto.body,
      owner: MESSAGE_OWNER.CUSTOMER,
      customer: currentCustomer,
    });
    // Process next answer
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
    let result = {
      responses: [],
      type: QUESTION_TYPE.FREE_TEXT,
      extraData: [],
    };
    let interestResults = null;

    // Introduction stage
    if (customer.currentStage === CONVERSATION_STAGE.INTRODUCTION) {
      result = await this._introductionHandler(body, customer);
    }
    // Capturing stage
    if (customer.currentStage === CONVERSATION_STAGE.CAPTURING) {
      if (body === SPECIAL_COMMAND.HELP) {
        result.responses.push(getRandomMessage(NEMO_ASK.HELP));
      } else {
        result = await this._capturingHandler(body);
      }
    }

    if (result.extraData.length > 0) {
      interestResults = JSON.stringify(result.extraData);
    }
    const messages = result.responses.map((nemoResponse) => {
      return this.repo.create({
        body: nemoResponse,
        owner: MESSAGE_OWNER.NEMO,
        customer,
        type: result.type,
        interestResults,
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
    const result = {
      responses: [],
      type: QUESTION_TYPE.FREE_TEXT,
      extraData: [],
    };

    const email = EmailUtil.extractFromText(body);
    if (email || body.includes(SPECIAL_COMMAND.SKIP)) {
      result.responses.push(getRandomMessage(NEMO_ASK.HELP));
      await this.customerService.updateOne(customer.id, {
        email,
        currentStage: CONVERSATION_STAGE.CAPTURING,
      });
    } else {
      result.responses.push(getRandomMessage(NEMO_PROMPT.EMAIL_FAILED));
    }
    return result;
  }
  private async _capturingHandler(body: string) {
    /**
     * 1. Customer asks for weather information
     * 2. Customer asks for covid information
     * 3. Customer asks for service information
     * 4. Customer asks for location information
     */
    const result = {
      responses: [],
      type: QUESTION_TYPE.FREE_TEXT,
      extraData: [],
    };
    try {
      const nlpResult = await this.nlpService.parse(body);
      const isAskingInfo = nlpResult.intent?.name === NLP_INTENT.ASKING_INFO;
      const entities = nlpResult.entities;

      if (isAskingInfo) {
        const weather = EntityUtil.extractValue(entities, NLP_ENTITY.WEATHER);
        const covid = EntityUtil.extractValue(entities, NLP_ENTITY.COVID);
        const service = EntityUtil.extractValue(entities, NLP_ENTITY.SERVICE);
        const location = EntityUtil.extractValue(entities, NLP_ENTITY.LOCATION);

        // Is asking for weather information
        if (weather) {
          const allLocs = await this.locationService.findNodeByName(location);
          if (allLocs?.length > 0) {
            result.responses.push(getRandomMessage(NEMO_ASK.WEATHER_SUCCESS));
            result.type = QUESTION_TYPE.WEATHER_TEXT;
            result.extraData = allLocs[0]?.id ? [allLocs[0].id] : [];
          } else {
            result.responses.push(
              getRandomMessage(NEMO_PROMPT.LOCATION_FAILED),
            );
          }
          // Is asking for covid information
        } else if (covid) {
          const allLocs = await this.locationService.findNodeByName(location);
          if (allLocs?.length > 0) {
            result.responses = await this.locationService.getLocCovidData(
              allLocs[0],
            );
          } else {
            result.responses.push(
              getRandomMessage(NEMO_PROMPT.LOCATION_FAILED),
            );
          }
          // Is asking for service information
        } else if (service) {
          const category = await this.categoryService.findCategoryByName(
            service,
          );
          const allLocs = await this.locationService.findNodeByName(
            location,
            true,
          );
          if (!category) {
            result.responses.push(getRandomMessage(NEMO_PROMPT.SERVICE_FAILED));
          } else if (allLocs?.length === 0) {
            result.responses.push(
              getRandomMessage(NEMO_PROMPT.LOCATION_FAILED),
            );
          } else if (category && allLocs?.length > 0) {
            const locationIds = allLocs.map((loc) => loc.id);
            const foundServices =
              await this.serviceService.findByCategoryAndLocation(
                [category.id],
                locationIds,
              );
            if (foundServices.length > 0) {
              result.extraData = foundServices.map((ser) => ser.id);
              result.responses.push(
                getRandomMessage(NEMO_ASK.SERVICE_SUCCESS).replace(
                  "#service-count",
                  foundServices.length.toString(),
                ),
              );
              result.type = QUESTION_TYPE.RESULT_TEXT;
            } else {
              result.responses.push(
                getRandomMessage(NEMO_PROMPT.SERVICE_FAILED),
              );
            }
          }
          // Is asking for location information
        } else if (location) {
          const allLocs = await this.locationService.findNodeByName(location);
          if (allLocs.length > 0) {
            result.responses = await this.locationService.getLocInfo(
              allLocs[0],
            );
          } else {
            result.responses.push(
              getRandomMessage(NEMO_PROMPT.LOCATION_FAILED),
            );
          }
        }
      }
      // Default to not understand message if there is no response
      if (result.responses.length === 0) {
        result.responses.push(getRandomMessage(NEMO_PROMPT.NOT_UNDERSTAND));
      }
    } catch (error) {
      ProjectLogger.exception(error.stack);
    }
    return result;
  }
}
