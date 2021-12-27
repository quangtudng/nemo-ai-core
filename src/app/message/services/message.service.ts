import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Message } from "../index.entity";
import { MessageRepository } from "../index.repository";
import { CustomerService } from "@app/customer/index.service";
@Injectable()
export class MessageService extends BaseCrudService<Message> {
  constructor(
    private repo: MessageRepository,
    private customerService: CustomerService,
  ) {
    super(repo);
  }
  async getCustomerMessages(customerLongId: string) {
    const customer = await this.customerService.findOneOrFail({
      longId: customerLongId,
    });
    return this.repo.find({
      where: {
        customer,
      },
      select: ["id", "body", "type", "owner", "createdAt"],
    });
  }
}
