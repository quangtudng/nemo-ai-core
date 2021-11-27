import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateLocationDTO {
  @ApiProperty({ example: "Example description" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  @IsOptional()
  description: string;
}
