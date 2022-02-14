import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength, ValidateIf } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Vũ trường" })
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      "Câu lạc bộ giải trí hay câu lạc bộ đêm là một địa điểm vui chơi giải trí mà thường hoạt động vào ban đêm và thường được phân biệt với các quán bar, quán rượu",
  })
  @MaxLength(500)
  @IsNotEmpty()
  @ValidateIf((_object, value) => value !== "")
  @IsOptional()
  description: string;
}
