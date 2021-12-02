import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from "class-validator";

export class FilterAmenityDTO extends BaseFilterDTO {
  @ApiProperty({ example: "Example Title", required: false })
  @Length(1, 100)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((object, value) => value !== "")
  title: string = "";
}
