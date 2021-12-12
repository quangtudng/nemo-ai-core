import { CategoryModule } from "@app/category/index.module";
import { ServiceModule } from "@app/service/index.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationController } from "./index.controller";
import { LocationRepository } from "./index.repository";
import { LocationService } from "./index.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([LocationRepository]),
    ServiceModule,
    CategoryModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService, TypeOrmModule],
})
export class LocationModule {}
