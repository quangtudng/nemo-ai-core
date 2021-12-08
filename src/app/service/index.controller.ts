import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-one";
import { UpdateServiceDTO } from "./dto/update-one";
import { Service } from "./index.entity";
import { ServiceService } from "./index.service";
import { DeleteResult } from "typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import { FilterServiceDTO } from "./dto/filter-many";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@ApiTags("services")
@Controller("services")
export class ServiceController {
  constructor(public service: ServiceService) {}

  @ApiOperation({ summary: "Create a service" })
  @Post()
  @IsAuth()
  createOne(@Body() dto: CreateServiceDto) {
    return this.service.createOne(dto);
  }

  @ApiOperation({ summary: "Create multiple services using excel file" })
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./src/app/service/uploads",
        filename: (req, file, cb) => {
          return cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadExcelFile(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      return this.service.createManyByExcel(file);
    }
    throw new NotFoundException(
      "You must include your excel file contaning the service file to proceed",
    );
  }

  @ApiOperation({ summary: "Find many service" })
  @Get()
  findMany(@Query() param: FilterServiceDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a service" })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Service> {
    return this.service.findOneOrFail(id, {
      relations: ["location", "category", "serviceImages", "amenities"],
    });
  }

  @ApiOperation({ summary: "Update a service" })
  @Patch(":id")
  @IsAuth()
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDTO,
  ): Promise<Service> {
    return this.service.updateOne(id, dto);
  }

  @ApiOperation({ summary: "Delete a service" })
  @Delete(":id")
  @IsAuth()
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
