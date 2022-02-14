import { CategoryRepository } from "@app/category/index.repository";
import { getRandomMessage, NEMO_PROMPT } from "@app/message/constants/message";
import { CovidUtil } from "@core/utils/covid";
import { LocationUtil } from "@core/utils/location";
import { ProjectLogger } from "@core/utils/loggers/log-service";
import { Injectable } from "@nestjs/common";
import { UpdateLocationDTO } from "./dto/update-one";
import { Location } from "./index.entity";
import { LocationRepository } from "./index.repository";

@Injectable()
export class LocationService {
  constructor(
    private repo: LocationRepository,
    private categoryRepo: CategoryRepository,
  ) {}

  async findNodeById(id: number) {
    return this.repo.findOneOrFail(id);
  }

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

  async findNodeByName(
    name: string,
    includeChildren: boolean = false,
  ): Promise<Location[]> {
    const location = await this.repo.findNodeByName(name);
    let allLocations = [];

    if (includeChildren) {
      const allDescendants = await this.repo.findAllDescendants(location);
      allLocations.push(allDescendants);
    } else {
      allLocations = location ? [location] : [];
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

  async getLocInfo(location: Location) {
    /**
     * Get a location general information
     */
    const responses = [];
    try {
      const loc = await this.findNode(location.id);
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
      } else {
        responses.push(
          `Hiện tại trong hệ thống của Nemo, ở ${LocationUtil.getTypeName(
            loc.type,
          )} ${loc.name} chưa có dịch vụ nào.`,
        );
      }
      return responses;
    } catch (error) {
      ProjectLogger.exception(error);
      return responses;
    }
  }

  async getLocCovidData(location: Location) {
    /**
     * Get a location covid data
     */
    const responses = [];
    try {
      const covidData = await CovidUtil.getCovidStatisticByName(location.name);
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
              location.type,
            )} ${location.name}:` +
            "\n• Tử vong: " +
            covidData.death +
            "\n• Đang chữa trị: " +
            covidData.treating +
            "\n• Ca nhiễm: " +
            covidData.cases +
            "\n• Hồi phục: " +
            covidData.recovered +
            "\n• Ca mới: " +
            covidData.casesToday +
            "\nNguồn: covid19.gov.vn";
          responses.push(covidText);
        }
      }
      return responses;
    } catch (error) {
      ProjectLogger.exception(error);
      return responses;
    }
  }
}
