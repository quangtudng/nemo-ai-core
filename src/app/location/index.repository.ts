import { EntityRepository, TreeRepository } from "typeorm";
import { Location } from "./index.entity";

@EntityRepository(Location)
export class LocationRepository extends TreeRepository<Location> {}
