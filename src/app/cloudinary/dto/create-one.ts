import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length, ValidateIf } from "class-validator";

export class UploadCloudinaryDTO {
  @ApiProperty({ example: "UNCATEGORIZED" })
  @Length(5, 100)
  @ValidateIf((_object, value) => value !== null && value !== "")
  @IsOptional()
  folder: string = "UNCATEGORIZED";
}
