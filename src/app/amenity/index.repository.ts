import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Amenity } from "./index.entity";
import { FilterAmenityDTO } from "./dto/filter-many";

@EntityRepository(Amenity)
export class AmenityRepository extends BaseCrudRepository<Amenity> {
  async findMany(param: FilterAmenityDTO): Promise<[Amenity[], number]> {
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    let builder = this.createQueryBuilder("amenity");
    if (param.title) {
      builder = builder.where("amenity.title like :title", {
        title: `%${param.title}%`,
      });
    }
    return builder.take(limit).skip(offset).getManyAndCount();
  }
}
