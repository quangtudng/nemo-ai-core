import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { WebhookDto } from "./dto/conversation";
import { MessageService } from "./services/message.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConversationService } from "./services/conversation.service";
import { SPECIAL_COMMAND } from "./constants/message";

@ApiTags("messages")
@Controller("messages")
export class MessageController {
  constructor(
    public messageService: MessageService,
    private conversationService: ConversationService,
  ) {}

  @ApiOperation({ summary: "Webhook for customer chat" })
  @Post("webhook")
  webhook(@Body() dto: WebhookDto) {
    if (dto.body === SPECIAL_COMMAND.NEW) {
      return this.conversationService.startNewConversation();
    }
    return this.conversationService.continueConversation(dto);
  }

  @ApiOperation({ summary: "Get a customer's messages" })
  @Get("/xhr/:customerLongId")
  async getCustomerMessages(@Param("customerLongId") customerLongId: string) {
    const messages = await this.messageService.getCustomerMessages(
      customerLongId,
    );
    return {
      data: messages,
    };
  }

  @ApiOperation({ summary: "Get a customer's message services by message id" })
  @Get("/customer_services/:messageId")
  async getCustomerServiceByMessageId(@Param("messageId") messageId: number) {
    return this.messageService.getCustomerServiceByMessageId(messageId);
  }

  @ApiOperation({ summary: "Get a customer's weather request by message id" })
  @Get("/weather_request/:messageId")
  async getLocationInfoByMessageId(@Param("messageId") messageId: number) {
    return this.messageService.getLocationInfoByMessageId(messageId);
  }
}
