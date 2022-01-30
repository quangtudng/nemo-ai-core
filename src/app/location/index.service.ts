import { CategoryRepository } from "@app/category/index.repository";
import {
  getRandomMessage,
  NEMO_PROMPT,
  NLP_ENTITY,
} from "@app/message/constants/message";
import { CovidUtil } from "@core/utils/covid";
import { LocationUtil } from "@core/utils/location";
import { ProjectLogger } from "@core/utils/loggers/log-service";
import { Injectable } from "@nestjs/common";
import { DeleteResult } from "typeorm";
import { UpdateLocationDTO } from "./dto/update-one";
import { Location } from "./index.entity";
import { LocationRepository } from "./index.repository";

@Injectable()
export class LocationService {
  constructor(
    private repo: LocationRepository,
    private categoryRepo: CategoryRepository,
  ) {}
  async findNode(id: number) {
    const location = await this.repo.findOneOrFail(id);
    const allDescendants = await this.repo.findAllDescendants(location);
    const allDescendantIds = allDescendants.map((loc) => loc.id);
    const categoryCount = await this.categoryRepo.findCategoryCountByLocation(
      allDescendantIds,
    );
    return {
      categoryCount,
      ...location,
    };
  }
  async findAllNodes(): Promise<Location[]> {
    let tree: Location[] = [];
    tree = await this.repo.findTrees({
      relations: ["services"],
    });

    for (let i = 0; i < tree.length; i++) {
      this.formatLocationServiceCount(tree[0]);
    }
    return tree;
  }

  async updateNode(id: number, dto: UpdateLocationDTO): Promise<Location> {
    const location = await this.repo.findOneOrFail(id);
    location.description = dto.description;
    return this.repo.save(location);
  }

  async deleteNode(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }

  async findNodeByName(
    name: string,
    includeChildren: boolean,
  ): Promise<Location[]> {
    const locations = await this.repo.findNodeByName(name);
    let allLocations = [];
    if (includeChildren) {
      for (let i = 0; i < locations.length; i++) {
        const allDescendants = await this.repo.findAllDescendants(locations[i]);
        allLocations.push(allDescendants);
      }
    } else {
      allLocations = [locations];
    }
    allLocations = allLocations.flat(2);
    return allLocations;
  }

  private formatLocationServiceCount(rootLocation) {
    rootLocation.serviceCount = rootLocation.services.length;
    if (rootLocation.children.length === 0) {
      return rootLocation.serviceCount;
    }
    for (let i = 0; i < rootLocation.children.length; i++) {
      const locationCount = this.formatLocationServiceCount(
        rootLocation.children[i],
      );
      rootLocation.serviceCount += locationCount;
    }
    return rootLocation.serviceCount;
  }

  async getAllLocationInfo(locations: Location[]) {
    const responses = [];
    try {
      const ids = locations.map((location) => location.id);
      for (let i = 0; i < ids.length; i++) {
        const loc = await this.findNode(ids[i]);
        if (loc.description) {
          responses.push(loc.description);
        }
        if (loc.categoryCount && loc.categoryCount.length > 0) {
          let serviceText = `Hiện tại trong hệ thống của Nemo, ở ${LocationUtil.getTypeName(
            loc.type,
          )} ${loc.name} có: \n`;
          loc.categoryCount.forEach((category, index) => {
            serviceText += `• ${category.count} ${category.category_title}`;
            if (index !== loc.categoryCount.length - 1) {
              serviceText += "\n";
            }
          });
          responses.push(serviceText);
        }
      }
      return responses;
    } catch (error) {
      ProjectLogger.exception(error);
      return responses;
    }
  }

  async getLocationCovidData(locations: Location[]) {
    const responses = [];
    try {
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        const covidData = await CovidUtil.getCovidStatisticByName(loc.name);
        if (covidData) {
          const haveZeroValueData =
            covidData.death === 0 &&
            covidData.treating === 0 &&
            covidData.cases === 0 &&
            covidData.recovered === 0 &&
            covidData.casesToday === 0;
          const haveNoCovidData =
            !covidData.death &&
            !covidData.treating &&
            !covidData.cases &&
            !covidData.recovered &&
            !covidData.casesToday;
          if (haveNoCovidData && !haveZeroValueData) {
            responses.push(getRandomMessage(NEMO_PROMPT.COVID_FAILED));
          } else {
            const covidText =
              `Hiện tại, số liệu covid-19 tại địa điểm du lịch ${LocationUtil.getTypeName(
                loc.type,
              )} ${loc.name}:` +
              "\n• Tử vong: " +
              covidData.death +
              "\n• Đang chữa trị: " +
              covidData.treating +
              "\n• Ca nhiễm: " +
              covidData.cases +
              "\n• Hồi phục: " +
              covidData.recovered +
              "\n• Ca mới: " +
              covidData.casesToday;
            responses.push(covidText);
          }
        }
      }
      return responses;
    } catch (error) {
      ProjectLogger.exception(error);
      return responses;
    }
  }

  async getLocationFromEntities(
    entities: any[],
    includeChildren: boolean = false,
  ): Promise<Location[]> {
    /**
     * Try to extract locations from entities collected by Rasa
     */
    let location: Location[] = [];
    try {
      const locationNames = entities
        .filter((entity) => entity.name === NLP_ENTITY.LOCATION)
        .map((entity) => entity.value);

      if (locationNames.length > 0) {
        location = await this.findNodeByName(locationNames[0], includeChildren);
      }
      return location;
    } catch (error) {
      ProjectLogger.exception(error);
      return location;
    }
  }
}
