import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Message } from "../index.entity";
import { MessageRepository } from "../index.repository";
import { WebhookDto } from "../dto/conversation";
import { CustomerService } from "@app/customer/index.service";
import { MESSAGE_OWNER, QUESTION_TYPE } from "../data/conversation";
import { getRandomMessage, NEMO_ASK } from "../data/message";
import { SENDGRID_API_KEY, SENDGRID_SENDER } from "@config/env";
import * as SendGrid from "@sendgrid/mail";

@Injectable()
export class ConversationService extends BaseCrudService<Message> {
  constructor(
    private repo: MessageRepository,
    private customerService: CustomerService,
  ) {
    super(repo);
  }
  async testEmail() {
    // TODO: Implement email sending serivce
    SendGrid.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: "quangtupct@gmail.com",
      from: SENDGRID_SENDER,
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    SendGrid.send(msg)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async startNewConversation(dto: WebhookDto, ip: string) {
    const newCustomer = await this.customerService.createNewCustomer({
      ip,
      viewed: 0,
    });
    const firstMessage = await this.repo.createOne({
      body: getRandomMessage(NEMO_ASK.START_CONVERSATION),
      owner: MESSAGE_OWNER.NEMO,
      customer: newCustomer,
      type: QUESTION_TYPE.FREE_TEXT,
    });
    // Return the first message response and new customer
    return {
      messages: [firstMessage],
      customer: newCustomer,
    };
  }

  async continueConversation(dto: WebhookDto) {
    const body = dto.body;
    const customer = await this.customerService.findOneOrFail({
      longId: dto.customerLongId,
    });
    // Save user response
    const newMessage = await this.repo.createOne({
      body,
      owner: MESSAGE_OWNER.CUSTOMER,
      customer,
      type: QUESTION_TYPE.FREE_TEXT,
    });
    const nemoAnswer =
      "Xin chào bạn, đây là câu trả lời mặc định của Nemo tại thời điểm hiện tại, chúng tôi sẽ cập nhật các tính năng để Nemo được thông minh hơn trong thời gian sắp tới";
    // Save nemo answer
    const nemoMessage = await this.repo.createOne({
      body: nemoAnswer,
      owner: MESSAGE_OWNER.NEMO,
      customer,
      type: QUESTION_TYPE.FREE_TEXT,
    });
    return {
      messages: [newMessage, nemoMessage],
      customer,
    };
  }
}
