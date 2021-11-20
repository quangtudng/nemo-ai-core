import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateAmenityDTO {
  @ApiProperty({ example: "Example title" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsOptional()
  title: string;

  @ApiProperty({ example: "Example description" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  @IsOptional()
  description: string;
}
