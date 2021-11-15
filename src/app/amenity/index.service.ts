import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Amenity } from "./index.entity";
import { AmenityRepository } from "./index.repository";

@Injectable()
export class AmenityService extends BaseCrudService<Amenity> {
  constructor(private repo: AmenityRepository) {
    super(repo);
  }
}
