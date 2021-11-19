import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Service } from "./index.entity";
import { ServiceRepository } from "./index.repository";

@Injectable()
export class ServiceService extends BaseCrudService<Service> {
  constructor(private repo: ServiceRepository) {
    super(repo);
  }
}
