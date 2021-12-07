import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import toStream = require("buffer-to-stream");

@Injectable()
export class CloudinaryService {
  async uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteCloudinaryImages(urls: string[]): Promise<any> {
    try {
      if (urls && urls.length !== 0) {
        const publicIds = urls.map((imageUrl) => {
          const urlObj = new URL(imageUrl);
          return urlObj.searchParams.get("public_id");
        });
        return new Promise((resolve, reject) => {
          v2.api.delete_resources(publicIds, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
        });
      }
      return {
        deleted: {},
      };
    } catch (error) {
      return {
        deleted: {},
      };
    }
  }
}
