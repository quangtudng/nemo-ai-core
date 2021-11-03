import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Example title" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiProperty({ example: "Example d" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;
}