import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class FilterServiceDTO extends BaseFilterDTO {
  @ApiProperty({ example: "Khách sạn", required: false })
  @MaxLength(500)
  @IsString()
  @IsOptional()
  title: string = "";

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryId: number = 0;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  locationId: number = 0;
}
