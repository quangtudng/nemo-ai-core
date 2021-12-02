import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from "class-validator";

export class CreateAmenityDto {
  @ApiProperty({ example: "Example title" })
  @Length(1, 100)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Example description" })
  @Length(1, 1000)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((object, value) => value !== "")
  description: string = "";
}
