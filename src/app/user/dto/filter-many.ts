import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class FilterUserDTO extends BaseFilterDTO {
  @ApiProperty({ example: "example@gmail.com" })
  @MaxLength(500)
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  roleId: number;
}
