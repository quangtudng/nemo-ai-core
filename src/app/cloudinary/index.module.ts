import { Module } from "@nestjs/common";
import { CloudinaryController } from "./index.controller";
import { CloudinaryProvider } from "./index.provider";
import { CloudinaryService } from "./index.service";
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
