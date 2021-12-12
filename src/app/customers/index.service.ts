import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Customers } from "./index.entity";
import { CustomerRepository } from "./index.repository";

@Injectable()
export class CustomerService extends BaseCrudService<Customers> {
  constructor(private repo: CustomerRepository) {
    super(repo);
  }
}
