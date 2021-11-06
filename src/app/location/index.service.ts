import { Injectable } from "@nestjs/common";
import { DeleteResult, Like } from "typeorm";
import { CreateLocationDto } from "./dto/create-one";
import { FilterLocationDTO } from "./dto/filter-tree-many";
import { UpdateLocationDTO } from "./dto/update-one";
import { Location } from "./index.entity";
import { LocationRepository } from "./index.repository";

@Injectable()
export class LocationService {
  constructor(private repo: LocationRepository) {}
  async createNode(dto: CreateLocationDto): Promise<Location> {
    const location = new Location();
    location.name = dto.name;
    location.type = dto.type;
    if (dto.parentId) {
      const parentLocation = await this.repo.findOne({ id: dto.parentId });
      location.parent = parentLocation;
    }
    return this.repo.save(location);
  }

  async findAllNodes(dto: FilterLocationDTO): Promise<Location[]> {
    if (dto.name) {
      return this.findTreeNodesByName(dto.name);
    } else {
      return this.repo.findTrees();
    }
  }

  async updateNode(id: number, dto: UpdateLocationDTO): Promise<Location> {
    const location = await this.repo.findOneOrFail(id);
    if (dto.name) location.name = dto.name;
    if (dto.type) location.type = dto.type;
    if (dto.parentId) {
      const parentLocation = await this.repo.findOne({ id: dto.parentId });
      location.parent = parentLocation;
    }
    return this.repo.save(location);
  }

  async deleteNode(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }

  private async findTreeNodesByName(name: string): Promise<Location[]> {
    const locations = await this.repo.find({
      where: { name: Like(`%${name}%`) },
    });
    const tree: Location[] = [];
    for (let i = 0; i < locations.length; i++) {
      const treeNodes = await this.repo.findDescendantsTree(locations[i]);
      tree.push(treeNodes);
    }
    return tree;
  }
}
