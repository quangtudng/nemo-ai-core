import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateCategoryDTO {
  @ApiProperty({ example: "Example title" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsOptional()
  title: string;

  @ApiProperty({ example: "Example d" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  @IsOptional()
  description: string;
}
