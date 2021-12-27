import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator";

export class WebhookDto {
  @ApiProperty({ example: "Xin chào, tôi muốn tìm kiếm địa điểm du lịch" })
  @Length(1, 1000)
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: 1, required: false })
  @Length(1, 1000)
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((object, value) => value !== "" && value != null)
  customerLongId: string;

  @ApiProperty({ example: 1, required: false })
  @Length(1, 100)
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((object, value) => value !== "" && value != null)
  timezone: number;
}
