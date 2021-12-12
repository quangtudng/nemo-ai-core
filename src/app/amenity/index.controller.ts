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
import { CreateAmenityDto } from "./dto/create-one";
import { UpdateAmenityDTO } from "./dto/update-one";
import { Amenity } from "./index.entity";
import { AmenityService } from "./index.service";
import { DeleteResult } from "typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";
import { FilterAmenityDTO } from "./dto/filter-many";

@ApiTags("amenities")
@Controller("amenities")
export class AmenityController {
  constructor(public service: AmenityService) {}

  @ApiOperation({ summary: "Create an amenity" })
  @Post()
  @IsAuth([USER_ROLE.SUPERADMIN])
  createOne(@Body() body: CreateAmenityDto): Promise<Amenity> {
    return this.service.createOne(body);
  }

  @ApiOperation({ summary: "Find many amenities" })
  @Get()
  findMany(@Query() param: FilterAmenityDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get an amenity" })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Amenity> {
    return this.service.findOneOrFail(id);
  }

  @ApiOperation({ summary: "Update an amenity" })
  @Patch(":id")
  @IsAuth([USER_ROLE.SUPERADMIN])
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateAmenityDTO,
  ): Promise<Amenity> {
    return this.service.updateOne(id, body);
  }

  @ApiOperation({ summary: "Delete an amenity" })
  @Delete(":id")
  @IsAuth([USER_ROLE.SUPERADMIN])
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
