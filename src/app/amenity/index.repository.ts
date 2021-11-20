import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Amenity } from "./index.entity";

@EntityRepository(Amenity)
export class AmenityRepository extends BaseCrudRepository<Amenity> {}
