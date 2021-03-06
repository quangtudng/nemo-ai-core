import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-one";
import { Category } from "./index.entity";
import { CategoryService } from "./index.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FilterCategoryDTO } from "./dto/filter-many";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";
import { UpdateCategoryDTO } from "./dto/update-one";
import { DeleteResult } from "typeorm";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(public service: CategoryService) {}

  @ApiOperation({ summary: "Create a category" })
  @Post()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  createOne(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.service.createOne(body);
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

  @ApiOperation({ summary: "Update a category" })
  @Patch(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDTO,
  ): Promise<Category> {
    return this.service.updateOne(id, body);
  }

  @ApiOperation({ summary: "Delete a category" })
  @Delete(":id")
  @IsAuth([USER_ROLE.SUPERADMIN])
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
