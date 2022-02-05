import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Message } from "../index.entity";
import { MessageRepository } from "../index.repository";
import { CustomerService } from "@app/customer/index.service";
import { SENDGRID_API_KEY, SENDGRID_SENDER } from "@config/env";
import * as SendGrid from "@sendgrid/mail";
import { ServiceService } from "@app/service/index.service";
import { ProjectLogger } from "@core/utils/loggers/log-service";
import { LocationService } from "@app/location/index.service";
@Injectable()
export class MessageService extends BaseCrudService<Message> {
  constructor(
    private repo: MessageRepository,
    private customerService: CustomerService,
    private serviceService: ServiceService,
    private locationService: LocationService,
  ) {
    super(repo);
  }
  async sendEmail() {
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

  async getCustomerMessages(customerLongId: string) {
    const customer = await this.customerService.findOneOrFail({
      longId: customerLongId,
    });
    await this.customerService.updateOne(customer.id, {
      viewed: 1,
    });
    return this.repo.find({
      where: {
        customer,
      },
      select: ["id", "body", "type", "owner", "createdAt"],
    });
  }

  async getCustomerServiceByMessageId(messageId: number) {
    try {
      const message = await this.repo.findOneOrFail({
        id: messageId,
      });
      const serviceIds = JSON.parse(message.interestResults);
      return this.serviceService.findServicesByIds(serviceIds);
    } catch (error) {
      ProjectLogger.exception(error.stack);
    }
  }

  async getLocationInfoByMessageId(messageId: number) {
    let name = "";
    let latitude = 0;
    let longitude = 0;
    try {
      const message = await this.repo.findOneOrFail({
        id: messageId,
      });
      const locations = JSON.parse(message.interestResults);
      if (locations && locations.length > 0) {
        const locationId = locations[0];
        const location = await this.locationService.findSimpleNodeById(
          locationId,
        );
        name = location.name;
        latitude = location.latitude;
        longitude = location.longitude;
      }
    } catch (error) {
      ProjectLogger.exception(error.stack);
    }
    return {
      name,
      latitude,
      longitude,
    };
  }
}
