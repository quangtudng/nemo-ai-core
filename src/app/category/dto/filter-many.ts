import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength } from "class-validator";

export class FilterCategoryDTO extends BaseFilterDTO {
  @ApiProperty({ example: "Vũ trường" })
  @MaxLength(500)
  @IsOptional()
  title: string;
}
