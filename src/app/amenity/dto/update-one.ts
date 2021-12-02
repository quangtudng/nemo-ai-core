import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from "class-validator";

export class UpdateAmenityDTO {
  @ApiProperty({ example: "Example title" })
  @Length(1, 100)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value && value !== "")
  title: string;

  @ApiProperty({ example: "Example description" })
  @Length(1, 1000)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value && value !== "")
  description: string;
}
