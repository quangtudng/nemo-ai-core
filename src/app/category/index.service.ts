import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Category } from "./index.entity";
import { CategoryRepository } from "./index.repository";

@Injectable()
export class CategoryService extends BaseCrudService<Category> {
  constructor(private repo: CategoryRepository) {
    super(repo);
  }
}
