import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import * as amenity_result from "@app/amenity/data/amenities.json";
import { Amenity } from "@app/amenity/index.entity";

export default class CreateAmenities implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const amenitiesToAdd = [];
    const amenities = amenity_result.results;
    Object.values(amenities).forEach((data) => {
      const amenity = new Amenity();
      amenity.title = data.label;
      amenity.description = data.label;
      amenity.icon = data.icon;
      amenitiesToAdd.push(amenity);
    });
    await connection
      .createQueryBuilder()
      .insert()
      .into(Amenity)
      .values(amenitiesToAdd)
      .execute();
  }
}
