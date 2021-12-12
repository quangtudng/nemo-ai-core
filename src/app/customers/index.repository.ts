import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Customers } from "./index.entity";

@EntityRepository(Customers)
export class CustomerRepository extends BaseCrudRepository<Customers> {}
