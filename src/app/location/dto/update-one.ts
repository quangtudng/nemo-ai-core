import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateLocationDTO {
  @ApiProperty({ example: "Location name example" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({ example: "city" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  parentId: number;
}
