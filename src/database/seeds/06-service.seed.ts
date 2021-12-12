import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import * as bars from "@app/service/data/bars.json";
import * as cafe from "@app/service/data/cafe.json";
import * as restaurants from "@app/service/data/restaurants.json";
import * as beach from "@app/service/data/beach.json";
import * as center from "@app/service/data/center.json";
import * as market from "@app/service/data/market.json";
import * as souvenir from "@app/service/data/souvenir.json";
import * as resort from "@app/service/data/resorts.json";
import * as hotels from "@app/service/data/hotels.json";
import * as homestays from "@app/service/data/homestays.json";
import { Service } from "@app/service/index.entity";
import { Location } from "@app/location/index.entity";
import { ServiceImage } from "@app/serviceimage/index.entity";
import { Category } from "@app/category/index.entity";
import { Amenity } from "@app/amenity/index.entity";
import slugify from "slugify";
import { PhoneNumberUtil } from "@core/utils/phone";

export default class CreateServices implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const allBars = Object.values(bars);
    const allCafes = Object.values(cafe);
    const allRestaurants = Object.values(restaurants);
    const allBeaches = Object.values(beach);
    const allCenters = Object.values(center);
    const allMarkets = Object.values(market);
    const allSouvenirs = Object.values(souvenir);
    const allResorts = Object.values(resort);
    const allHotels = Object.values(hotels);
    const allHomestays = Object.values(homestays);
    await this.addService(connection, allBars, "Quán bar");
    await this.addService(connection, allCafes, "Quán cafe");
    await this.addService(connection, allRestaurants, "Nhà hàng ăn uống");
    await this.addService(connection, allBeaches, "Bãi biển");
    await this.addService(connection, allCenters, "Trung tâm mua sắm");
    await this.addService(connection, allMarkets, "Chợ mua sắm");
    await this.addService(connection, allSouvenirs, "Cửa hàng lưu niệm");
    await this.addService(connection, allResorts, "Khu nghỉ dưỡng");
    await this.addService(connection, allHotels, "Khách sạn");
    await this.addService(connection, allHomestays, "Homestays");
  }

  private async addService(
    connection: Connection,
    allServices: Array<any>,
    type: string,
  ) {
    const servicesToAdd = [];
    for (let i = 0; i < allServices.length; i++) {
      const service: any = allServices[i];
      // Location
      const location = await this.fetchLocation(connection, service.locations);
      if (!location) {
        console.log(
          `Warning: Cannot find location in service ${service.title}`,
        );
      }

      // Category
      const category = await this.fetchCategory(connection, type);
      // Price
      const price = service?.price;

      // Amenities
      const amenities = await this.fetchAmenities(
        connection,
        service.amenities,
      );

      const images = await this.addServiceImages(connection, service.images);
      const slug = slugify(`${service.title} ${Date.now()}`, {
        replacement: "-",
        lower: true,
        trim: true,
      });
      // Create new service object
      const serviceObj = connection.createEntityManager().create(Service);
      serviceObj.title = service.title || "";
      serviceObj.location = location;
      serviceObj.fullAddress = service.fullAddress || "";
      serviceObj.phoneNumber = PhoneNumberUtil.format(
        service.phoneNumber || "",
      );
      serviceObj.category = category;
      serviceObj.price = price;
      serviceObj.slug = slug;
      serviceObj.serviceImages = images;
      serviceObj.originUrl = service.url || "";
      serviceObj.thumbnail = service.thumbnail || "";
      serviceObj.amenities = amenities;
      servicesToAdd.push(serviceObj);
    }

    await connection.createEntityManager().save(Service, servicesToAdd);
  }
  private async fetchLocation(connection: Connection, locationNames: string[]) {
    const allLocations = await connection
      .createQueryBuilder<Location>(Location, "location")
      .where("location.name IN (:...names)", { names: locationNames })
      .getMany();
    return allLocations.length > 1 ? allLocations[1] : allLocations[0];
  }

  private async fetchCategory(
    connection: Connection,
    categoryName: string,
  ): Promise<Category> {
    return connection
      .createQueryBuilder<Category>(Category, "category")
      .where("category.title = :title", { title: categoryName })
      .getOne();
  }
  private async addServiceImages(
    connection: Connection,
    images: Array<any>,
  ): Promise<ServiceImage[]> {
    const imageObjArr = [];
    for (let i = 0; i < images.length; i++) {
      const imageObj = connection.createEntityManager().create(ServiceImage);
      imageObj.fallbackUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
      imageObj.url = images[i];
      imageObjArr.push(imageObj);
    }
    return imageObjArr;
  }

  private async fetchAmenities(connection: Connection, amenities: string[]) {
    let allAmenitiesObjects = [];
    if (amenities && amenities.length > 0) {
      allAmenitiesObjects = await connection
        .createQueryBuilder<Amenity>(Amenity, "amenity")
        .where("amenity.title IN (:...names)", { names: amenities })
        .getMany();
    }
    return allAmenitiesObjects;
  }
}
