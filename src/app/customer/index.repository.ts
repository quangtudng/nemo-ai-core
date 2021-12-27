import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Customer } from "./index.entity";

@EntityRepository(Customer)
export class CustomerRepository extends BaseCrudRepository<Customer> {}
