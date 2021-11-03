import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class FilterCategoryDTO extends BaseFilterDTO {
  @ApiProperty({ example: "Example title", required: false })
  @MaxLength(500)
  @IsString()
  @IsOptional()
  title: string = "";

  @ApiProperty({ example: "Example description", required: false })
  @MaxLength(255)
  @IsString()
  @IsOptional()
  description: string = "";
}
