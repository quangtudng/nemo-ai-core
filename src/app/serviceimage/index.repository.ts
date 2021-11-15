import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { ServiceImage } from "./index.entity";

@EntityRepository(ServiceImage)
export class ServiceImageRepository extends BaseCrudRepository<ServiceImage> {}
