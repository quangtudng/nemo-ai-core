import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { ServiceImage } from "./index.entity";
import { Service } from "@app/service/index.entity";

@EntityRepository(ServiceImage)
export class ServiceImageRepository extends BaseCrudRepository<ServiceImage> {
  async deleteManyByService(service: Service) {
    return this.delete({
      service,
    });
  }
}
