/* eslint-disable @typescript-eslint/naming-convention */
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "@config/env";
import { v2 } from "cloudinary";

export const CloudinaryProvider = {
  provide: "Cloudinary",
  useFactory: () => {
    return v2.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  },
};
