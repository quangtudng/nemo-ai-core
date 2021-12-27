import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { WebhookDto } from "./dto/conversation";
import { MessageService } from "./services/message.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RealIp } from "nestjs-real-ip";
import { ConversationService } from "./services/conversation.service";

@ApiTags("messages")
@Controller("messages")
export class MessageController {
  constructor(
    public messageService: MessageService,
    private conversationService: ConversationService,
  ) {}

  @ApiOperation({ summary: "Webhook for customer chat" })
  @Post("webhook")
  webhook(@Body() dto: WebhookDto, @RealIp() ipAddress: string) {
    if (dto.body === "new") {
      return this.conversationService.startNewConversation(dto, ipAddress);
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
}
