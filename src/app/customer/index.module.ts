import { ServiceModule } from "@app/service/index.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerController } from "./index.controller";
import { CustomerRepository } from "./index.repository";
import { CustomerService } from "./index.service";
@Module({
  imports: [TypeOrmModule.forFeature([CustomerRepository]), ServiceModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService, TypeOrmModule],
})
export class CustomerModule {}
