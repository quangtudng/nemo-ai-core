import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "./index.controller";
import { CategoryRepository } from "./index.repository";
import { CategoryService } from "./index.service";
@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
