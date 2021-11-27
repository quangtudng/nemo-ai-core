import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { LocationService } from "./index.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Location } from "./index.entity";
import { UpdateLocationDTO } from "./dto/update-one";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@core/constants/user-role";

@ApiTags("locations")
@Controller("locations")
export class LocationController {
  constructor(public service: LocationService) {}

  @ApiOperation({ summary: "Get many locations" })
  @Get()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  findMany() {
    return this.service.findAllNodes();
  }

  @ApiOperation({ summary: "Get a location" })
  @Get(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findNode(id);
  }

  @ApiOperation({ summary: "Update a location" })
  @Patch(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDTO,
  ): Promise<Location> {
    return this.service.updateNode(id, dto);
  }
}
