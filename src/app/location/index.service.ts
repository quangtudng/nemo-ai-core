import { CategoryRepository } from "@app/category/index.repository";
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
    if (dto.description) location.description = dto.description;
    return this.repo.save(location);
  }

  async deleteNode(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
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
}
