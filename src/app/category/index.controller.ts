import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-one";
import { Category } from "./index.entity";
import { CategoryService } from "./index.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FilterCategoryDTO } from "./dto/filter-many";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(public service: CategoryService) {}

  @ApiOperation({ summary: "Create a category" })
  @Post()
  createOne(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.service.createOne(dto);
  }

  @ApiOperation({ summary: "Get many categories" })
  @Get()
  findMany(@Query() param: FilterCategoryDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a category" })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Category> {
    return this.service.findOneOrFail(id);
  }
}
