import { CategoryModule } from "@app/category/index.module";
import { CustomerModule } from "@app/customer/index.module";
import { LocationModule } from "@app/location/index.module";
import { NlpModule } from "@app/nlp/index.module";
import { ServiceModule } from "@app/service/index.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageController } from "./index.controller";
import { MessageRepository } from "./index.repository";
import { ConversationService } from "./services/conversation.service";
import { MessageService } from "./services/message.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository]),
    CustomerModule,
    NlpModule,
    LocationModule,
    CategoryModule,
    ServiceModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, ConversationService],
  exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
