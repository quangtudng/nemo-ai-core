import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator";

export class UpdateLocationDTO {
  @ApiProperty({
    example:
      "Đà Nẵng là một thành phố trực thuộc trung ương, nằm trong vùng Duyên hải Nam Trung Bộ Việt Nam, là thành phố trung tâm và lớn nhất khu vực miền Trung - Tây Nguyên.",
  })
  @Length(1, 1000)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  description: string;
}
