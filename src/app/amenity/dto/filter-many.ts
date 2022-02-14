import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength, ValidateIf } from "class-validator";

export class FilterAmenityDTO extends BaseFilterDTO {
  @ApiProperty({ example: "Phòng sang trọng" })
  @MaxLength(100)
  @IsNotEmpty()
  @ValidateIf((_object, value) => value !== "")
  @IsOptional()
  title: string;
}
