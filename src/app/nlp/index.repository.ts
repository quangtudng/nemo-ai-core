import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Nlp } from "./index.entity";

@EntityRepository(Nlp)
export class NlpRepository extends BaseCrudRepository<Nlp> {}
