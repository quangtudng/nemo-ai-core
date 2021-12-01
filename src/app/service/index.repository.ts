import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Service } from "./index.entity";
import { FilterServiceDTO } from "./dto/filter-many";
import { ProjectLogger } from "@core/utils/loggers/log-service";

@EntityRepository(Service)
export class ServiceRepository extends BaseCrudRepository<Service> {
  async findManyByLocations(
    param: FilterServiceDTO,
    locationIds: number[],
  ): Promise<[Service[], number]> {
    try {
      const limit = param.limit || 5;
      const offset =
        param.page && param.page > 1 ? (param.page - 1) * limit : 0;
      let builder = this.createQueryBuilder("service")
        .leftJoinAndSelect("service.location", "location")
        .leftJoinAndSelect("service.category", "category")
        .leftJoinAndSelect("service.serviceImages", "images")
        .leftJoinAndSelect("service.amenities", "amenities")
        .where("service.title like :title", {
          title: `%${param.title}%`,
        });
      if (locationIds.length > 0) {
        builder = builder.andWhere("service.location_id IN (:...locationIds)", {
          locationIds,
        });
      }
      if (param.categoryId) {
        builder = builder.andWhere("service.category_id = :categoryId", {
          categoryId: param.categoryId,
        });
      }
      return builder.take(limit).skip(offset).getManyAndCount();
    } catch (exception) {
      ProjectLogger.exception(exception.stack);
      return [[], 0];
    }
  }
}
