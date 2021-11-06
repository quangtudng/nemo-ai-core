import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationController } from "./index.controller";
import { LocationRepository } from "./index.repository";
import { LocationService } from "./index.service";
@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService, TypeOrmModule],
})
export class LocationModule {}
