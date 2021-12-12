import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator";

export class UpdateCategoryDTO {
  @ApiProperty({ example: "Vũ trường" })
  @Length(1, 100)
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty({
    example:
      "Câu lạc bộ giải trí hay câu lạc bộ đêm là một địa điểm vui chơi giải trí mà thường hoạt động vào ban đêm và thường được phân biệt với các quán bar, quán rượu",
  })
  @Length(5, 1000)
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((object, value) => value !== "")
  description: string;
}
