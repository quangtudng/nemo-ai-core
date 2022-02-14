import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Message } from "../index.entity";
import { MessageRepository } from "../index.repository";
import { CustomerService } from "@app/customer/index.service";
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
    let services = [];
    try {
      const message = await this.repo.findOneOrFail({
        id: messageId,
      });
      const serviceIds = this._parseInterestResults(message.interestResults);
      if (serviceIds && serviceIds.length > 0) {
        services = await this.serviceService.findServicesByIds(serviceIds);
      }
    } catch (error) {
      ProjectLogger.exception(error.stack);
    }
    return services;
  }

  async getLocationInfoByMessageId(messageId: number) {
    let name = "";
    let latitude = 0;
    let longitude = 0;
    try {
      const message = await this.repo.findOneOrFail({
        id: messageId,
      });
      const locations = this._parseInterestResults(message.interestResults);
      if (locations && locations.length > 0) {
        const locationId = locations[0];
        const location = await this.locationService.findNodeById(locationId);
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

  private _parseInterestResults(interestResults: string) {
    let result = [];
    try {
      result = JSON.parse(interestResults);
    } catch (error) {
      ProjectLogger.exception(error.stack);
    }
    return result;
  }
}
