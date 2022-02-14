import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength, ValidateIf } from "class-validator";

export class CreateAmenityDto {
  @ApiProperty({ example: "Phòng sang trọng" })
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      "Phòng cao cấp nhất trong khách sạn. Phòng thường ở trên tầng cao, được trang bị những thiết bị cao cấp và các dịch vụ đặc biệt kèm theo",
  })
  @MaxLength(1000)
  @IsNotEmpty()
  @ValidateIf((_object, value) => value !== "")
  @IsOptional()
  description: string;

  @ApiProperty({ example: "home" })
  @MaxLength(100)
  @IsNotEmpty()
  icon: string;
}
