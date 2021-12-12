import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";
import { ProjectLogger } from "@core/utils/loggers/log-service";
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UploadCloudinaryDTO } from "./dto/create-one";
import { CloudinaryService } from "./index.service";

@ApiTags("cloudinary")
@Controller("cloudinary")
export class CloudinaryController {
  constructor(public service: CloudinaryService) {}

  @ApiOperation({ summary: "Upload an image" })
  @Post("upload")
  @UseInterceptors(FilesInterceptor("file"))
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: UploadCloudinaryDTO,
  ) {
    const imageResults = [];
    try {
      if (files && files.length !== 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uploadedResult = await this.service.uploadImageToCloudinary(
            file,
            dto.folder,
          );
          const urlObj = new URL(uploadedResult.url);
          // Set public id for ease of access and delete later
          urlObj.searchParams.set("public_id", uploadedResult.public_id);
          imageResults.push({
            publicId: uploadedResult.public_id,
            url: urlObj.toString(),
            width: uploadedResult.width,
            height: uploadedResult.height,
            format: uploadedResult.format,
            createdAt: uploadedResult.created_at,
          });
        }
      }
      return {
        data: imageResults,
      };
    } catch (error) {
      ProjectLogger.exception(error);
      return {
        data: imageResults,
      };
    }
  }
}
