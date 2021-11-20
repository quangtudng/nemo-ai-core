import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import * as categories from "@app/category/data/categories.json";
import { Category } from "@app/category/index.entity";

export default class CreateCategories implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const categoriesToAdd = [];
    Object.values(categories).forEach((data) => {
      const category = new Category();
      category.title = data.title;
      category.description = data.description;
      categoriesToAdd.push(category);
    });
    await connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoriesToAdd)
      .execute();
  }
}
