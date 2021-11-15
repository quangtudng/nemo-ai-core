import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { ServiceImage } from "./index.entity";
import { ServiceImageRepository } from "./index.repository";

@Injectable()
export class ServiceImageService extends BaseCrudService<ServiceImage> {
  constructor(private repo: ServiceImageRepository) {
    super(repo);
  }
}
