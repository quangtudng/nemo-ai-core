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
import { CreateUserDto } from "./dto/create-one";
import { UpdateUserDTO } from "./dto/update-one";
import { User } from "./index.entity";
import { UserService } from "./index.service";
import { DeleteResult } from "typeorm";
import { FilterUserDTO } from "./dto/filter-many";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(public service: UserService) {}

  @ApiOperation({ summary: "Create a user" })
  @Post()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  createOne(@Body() body: CreateUserDto): Promise<User> {
    return this.service.createOne(body);
  }

  @ApiOperation({ summary: "Get many users" })
  @Get()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  findMany(@Query() param: FilterUserDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a user" })
  @Get(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  async getOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    const result = await this.service.findOneOrFail(id, {
      relations: ["role"],
    });
    delete result["password"];
    return result;
  }

  @ApiOperation({ summary: "Update a user" })
  @Patch(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ): Promise<User> {
    return this.service.updateOne(id, body);
  }

  @ApiOperation({ summary: "Delete a user" })
  @Delete(":id")
  @IsAuth([USER_ROLE.SUPERADMIN])
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
