import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateLocationDto {
  @ApiProperty({ example: "Location name example" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Location type example" })
  @IsString()
  @IsNotEmpty()
  @IsIn(["city", "province"])
  type: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  parentId: number;
}
