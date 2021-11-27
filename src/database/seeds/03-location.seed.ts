import { Location } from "@app/location/index.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import * as cities from "@app/location/data/thanh_pho.json";
import * as provinces from "@app/location/data/tinh.json";

export default class CreateLocations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await this.addVietnam(connection);
    await this.addProvinces(connection);
    await this.addMunicipalCities(connection);
    await this.addCities(connection);
  }

  private async addVietnam(connection: Connection) {
    const location = new Location();
    location.name = "Việt Nam";
    location.type = "country";
    location.description = `Việt Nam, tên gọi chính thức là Cộng hòa Xã hội chủ nghĩa Việt Nam, là quốc gia nằm ở cực Đông của bán đảo Đông Dương thuộc khu vực Đông Nam Á,giáp với Lào, Campuchia, Trung Quốc, biển Đông và vịnh Thái Lan. Lãnh thổ Việt Nam xuất hiện con người sinh sống từ thời đại đồ đá cũ.`;
    await connection
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(location)
      .execute();
  }

  private async addProvinces(connection: Connection) {
    const provinceToAdd: Location[] = [];
    const parent = await this.findParentLocation(connection, "Việt Nam");
    Object.values(provinces).forEach((province) => {
      const location = new Location();
      location.name = province.name;
      location.type = "province";
      location.description = province.description;
      location.parent = parent;
      provinceToAdd.push(location);
    });
    await connection.getRepository(Location).save(provinceToAdd);
  }

  private async addMunicipalCities(connection: Connection) {
    const municipalCitiesToAdd: Location[] = [];
    const parent = await this.findParentLocation(connection, "Việt Nam");
    Object.values(cities).forEach((city) => {
      if (!city.parent_code) {
        const location = new Location();
        location.name = city.name;
        location.type = "city";
        location.description = city.description;
        location.parent = parent;
        municipalCitiesToAdd.push(location);
      }
    });
    await connection
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(municipalCitiesToAdd)
      .execute();
  }

  private async addCities(connection: Connection) {
    const citiesToAdd: Location[] = [];
    const allCities = Object.values(cities);
    for (let i = 0; i < allCities.length; i++) {
      const city = allCities[i];
      if (city.parent_code) {
        const location = new Location();
        location.name = city.name;
        location.type = "city";
        location.description = city.description;
        const parent = provinces[city.parent_code] || cities[city.parent_code];
        if (parent) {
          const parentLocation = await this.findParentLocation(
            connection,
            parent.name,
          );
          location.parent = parentLocation;
        }
        citiesToAdd.push(location);
      }
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(citiesToAdd)
      .execute();
  }

  private async findParentLocation(
    connection: Connection,
    locationName: string,
  ): Promise<Location> {
    return connection
      .createQueryBuilder<Location>(Location, "location")
      .where("location.name = :name", { name: locationName })
      .getOne();
  }
}
