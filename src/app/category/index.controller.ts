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
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@core/constants/user-role";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(public service: CategoryService) {}

  @ApiOperation({ summary: "Create a category" })
  @Post()
  @IsAuth([USER_ROLE.SUPERADMIN])
  createOne(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.service.createOne(dto);
  }

  @ApiOperation({ summary: "Get many categories" })
  @Get()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  findMany(@Query() param: FilterCategoryDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a category" })
  @Get(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Category> {
    return this.service.findOneOrFail(id);
  }
}
