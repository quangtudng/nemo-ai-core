import { AmenityModule } from "@app/amenity/index.module";
import { LocationModule } from "@app/location/index.module";
import { ServiceImageModule } from "@app/serviceimage/index.module";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceController } from "./index.controller";
import { ServiceRepository } from "./index.repository";
import { ServiceService } from "./index.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRepository]),
    forwardRef(() => LocationModule),
    AmenityModule,
    ServiceImageModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService, TypeOrmModule],
})
export class ServiceModule {}
