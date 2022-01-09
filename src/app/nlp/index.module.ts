import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NlpRepository } from "./index.repository";
import { NlpService } from "./index.service";
@Module({
  imports: [TypeOrmModule.forFeature([NlpRepository])],
  providers: [NlpService],
  exports: [NlpService, TypeOrmModule],
})
export class NlpModule {}
