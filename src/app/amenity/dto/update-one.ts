import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator";

export class UpdateAmenityDTO {
  @ApiProperty({ example: "Phòng sang trọng" })
  @Length(1, 100)
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty({
    example:
      "Phòng cao cấp nhất trong khách sạn. Phòng thường ở trên tầng cao, được trang bị những thiết bị cao cấp và các dịch vụ đặc biệt kèm theo",
  })
  @Length(1, 1000)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  description: string;
}
