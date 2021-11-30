import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Service } from "./index.entity";
import { ServiceRepository } from "./index.repository";
import { FilterServiceDTO } from "./dto/filter-many";
import { LocationRepository } from "@app/location/index.repository";
import { CreateServiceDto } from "./dto/create-one";
import slugify from "slugify";
import { UpdateServiceDTO } from "./dto/update-one";
import { AmenityRepository } from "@app/amenity/index.repository";
import { ServiceImageRepository } from "@app/serviceimage/index.repository";

@Injectable()
export class ServiceService extends BaseCrudService<Service> {
  constructor(
    private serviceRepo: ServiceRepository,
    private locationRepo: LocationRepository,
    private amenityRepo: AmenityRepository,
    private serviceImageRepo: ServiceImageRepository,
  ) {
    super(serviceRepo);
  }

  async createOne(dto: CreateServiceDto): Promise<Service> {
    const slug = slugify(`${dto.title} ${Date.now()}`, {
      replacement: "-",
      lower: true,
      trim: true,
    });
    // Find amenities
    const amenitieIds = dto.serviceAmenities || [];
    const amenities = await this.amenityRepo.findByIds(amenitieIds);
    // Find service images
    const serviceImageUrls = dto.serviceImageUrls || [];
    const serviceImages = serviceImageUrls.map((url) =>
      this.serviceImageRepo.create({
        url,
        fallbackUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
      }),
    );
    // Create service
    const entity = this.serviceRepo.create({
      ...dto,
      slug,
      amenities,
      serviceImages,
    });
    return this.serviceRepo.save(entity);
  }

  async updateOne(id: number, dto: UpdateServiceDTO): Promise<Service> {
    let entity = await this.serviceRepo.findOneOrFail(id);
    if (dto.title) {
      entity.slug = slugify(`${dto.title} ${Date.now()}`, {
        replacement: "-",
        lower: true,
        trim: true,
      });
    }
    // Find amenities
    const amenitieIds = dto.serviceAmenities || [];
    const amenities = await this.amenityRepo.findByIds(amenitieIds);
    // Remove old images (this is probably the easier way)
    await this.serviceImageRepo.deleteManyByService(entity);
    // Find service images
    const serviceImageUrls = dto.serviceImageUrls || [];
    const serviceImages = serviceImageUrls.map((url) =>
      this.serviceImageRepo.create({
        url,
        fallbackUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
      }),
    );
    entity = {
      ...entity,
      ...dto,
      amenities,
      serviceImages,
    };
    return this.serviceRepo.save(entity);
  }

  async findMany(param: FilterServiceDTO) {
    let locationDescendantIds = [];
    // Find all descendants of a location
    if (param.locationId) {
      const location = await this.locationRepo.findOneOrFail(param.locationId);
      const locationDescendants = await this.locationRepo.findAllDescendants(
        location,
      );
      locationDescendantIds = locationDescendants.map((loc) => loc.id);
    }
    // Find all services by locations
    const data = await this.serviceRepo.findManyByLocations(
      param,
      locationDescendantIds,
    );
    const totalPageCount = data[1] / (param.limit || 5);
    return {
      data: data[0],
      count: data[0].length,
      total: data[1],
      page: Number(param.page || 1),
      pageCount: Math.ceil(totalPageCount ? totalPageCount : 0),
    };
  }
}
