import { ProjectLogger } from "@core/utils/loggers/log-service";
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "./index.service";

@ApiTags("cloudinary")
@Controller("cloudinary")
export class CloudinaryController {
  constructor(public service: CloudinaryService) {}

  @ApiOperation({ summary: "Upload an image" })
  @Post("upload")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const imageResults = [];
    try {
      if (files && files.length !== 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uploadedResult = await this.service.uploadImageToCloudinary(
            file,
          );
          const urlObj = new URL(uploadedResult.url);
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
