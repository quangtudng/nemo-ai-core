import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AmenityController } from "./index.controller";
import { AmenityRepository } from "./index.repository";
import { AmenityService } from "./index.service";
@Module({
  imports: [TypeOrmModule.forFeature([AmenityRepository])],
  controllers: [AmenityController],
  providers: [AmenityService],
  exports: [AmenityService, TypeOrmModule],
})
export class AmenityModule {}
