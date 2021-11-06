import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class FilterLocationDTO {
  @ApiProperty({ required: false })
  @MaxLength(500)
  @IsString()
  @IsOptional()
  name: string = "";
}
