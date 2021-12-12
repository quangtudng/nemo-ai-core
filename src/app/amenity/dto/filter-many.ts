import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator";

export class FilterAmenityDTO extends BaseFilterDTO {
  @ApiProperty({ example: "Phòng sang trọng" })
  @Length(1, 100)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  title: string;
}
