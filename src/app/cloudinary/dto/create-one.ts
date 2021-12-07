import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length, ValidateIf } from "class-validator";

export class UploadCloudinaryDTO {
  @ApiProperty({ example: "UNCATEGORIZED", required: false })
  @Length(5, 100)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  folder: string = "UNCATEGORIZED";
}
