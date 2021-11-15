import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceImageRepository } from "./index.repository";
import { ServiceImageService } from "./index.service";
@Module({
  imports: [TypeOrmModule.forFeature([ServiceImageRepository])],
  providers: [ServiceImageService],
  exports: [ServiceImageService, TypeOrmModule],
})
export class ServiceImageModule {}
