import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Category } from "./index.entity";
import { FilterCategoryDTO } from "./dto/filter-many";

@EntityRepository(Category)
export class CategoryRepository extends BaseCrudRepository<Category> {
  async findMany(param: FilterCategoryDTO): Promise<[Category[], number]> {
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    return this.createQueryBuilder("category")
      .where("category.title like :title", { title: `%${param.title}%` })
      .andWhere("category.description like :description", {
        description: `%${param.description}%`,
      })
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }
}
