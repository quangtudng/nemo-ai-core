import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Category } from "./index.entity";
import { FilterCategoryDTO } from "./dto/filter-many";

@EntityRepository(Category)
export class CategoryRepository extends BaseCrudRepository<Category> {
  async findMany(param: FilterCategoryDTO): Promise<[Category[], number]> {
    /**
     * Find many categories using pagination
     */
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    let builder = this.createQueryBuilder("category");
    if (param.title) {
      builder = builder.where("category.title like :title", {
        title: `%${param.title}%`,
      });
    }
    return builder.take(limit).skip(offset).getManyAndCount();
  }

  async findCategoryByName(name: string): Promise<Category> {
    /**
     * Find first category by name
     */
    let builder = this.createQueryBuilder("category");
    if (name) {
      builder = builder.where("category.title like :title", {
        title: `%${name}%`,
      });
    }
    return builder.getOne();
  }

  async findCategoryCountByLocation(locationIds: number[]) {
    /**
     * Find category count by location
     */
    let builder = this.createQueryBuilder("category").leftJoinAndSelect(
      "category.services",
      "services",
    );
    if (locationIds) {
      builder = builder.where("services.location_id IN (:...locationIds)", {
        locationIds,
      });
    }
    return builder
      .groupBy("category.id")
      .select("COUNT(category.id)", "count")
      .addSelect(["category.id", "category.title", "category.slug"])
      .getRawMany();
  }
}
