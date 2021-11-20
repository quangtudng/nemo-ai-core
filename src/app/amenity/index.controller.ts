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
import { BaseFilterDTO } from "@core/dto/filter-many";
import { DeleteResult } from "typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@core/constants/user-role";

@ApiTags("amenities")
@Controller("amenities")
export class AmenityController {
  constructor(public service: AmenityService) {}

  @ApiOperation({ summary: "Create a amenity" })
  @Post()
  @IsAuth([USER_ROLE.SUPERADMIN])
  createOne(@Body() dto: CreateAmenityDto): Promise<Amenity> {
    return this.service.createOne(dto);
  }

  @ApiOperation({ summary: "Find many amenities" })
  @Get()
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a amenity" })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Amenity> {
    return this.service.findOneOrFail(id);
  }

  @ApiOperation({ summary: "Update a amenity" })
  @Patch(":id")
  @IsAuth([USER_ROLE.SUPERADMIN])
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAmenityDTO,
  ): Promise<Amenity> {
    return this.service.updateOne(id, dto);
  }

  @ApiOperation({ summary: "Delete a amenity" })
  @Delete(":id")
  @IsAuth([USER_ROLE.SUPERADMIN])
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
