import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Category } from "./index.entity";
import { CategoryRepository } from "./index.repository";
import { NLP_ENTITY } from "@app/message/constants/message";
import { ProjectLogger } from "@core/utils/loggers/log-service";

@Injectable()
export class CategoryService extends BaseCrudService<Category> {
  constructor(private repo: CategoryRepository) {
    super(repo);
  }

  async findCategoriesByName(name: string) {
    return this.repo.findManyByName(name);
  }

  async getCategoryFromEntities(entities: any[]): Promise<Category[]> {
    let categories = [];
    try {
      const categoryEntities = entities
        .filter((entity) => entity.name === NLP_ENTITY.SERVICE)
        .map((entity) => entity.value);
      for (let i = 0; i < categoryEntities.length; i++) {
        const catName = categoryEntities[i];
        const resultCat = await this.findCategoriesByName(catName);
        categories.push(resultCat);
      }
      categories = categories.flat(2);
      return categories;
    } catch (error) {
      ProjectLogger.exception(error);
      return categories;
    }
  }
}
