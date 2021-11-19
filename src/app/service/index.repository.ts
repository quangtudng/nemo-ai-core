import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Service } from "./index.entity";
import { BaseFilterDTO } from "@core/dto/filter-many";

@EntityRepository(Service)
export class ServiceRepository extends BaseCrudRepository<Service> {
  async findMany(param: BaseFilterDTO): Promise<[Service[], number]> {
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    return this.createQueryBuilder("service")
      .leftJoinAndSelect("service.location", "location")
      .leftJoinAndSelect("service.category", "category")
      .leftJoinAndSelect("service.serviceImages", "images")
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }
}
