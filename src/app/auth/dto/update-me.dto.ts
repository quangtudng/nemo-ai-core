import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPhoneNumber, Length, ValidateIf } from "class-validator";

export class UpdateMeDTO {
  @ApiProperty({ example: "Quang Tu" })
  @Length(5, 50)
  @IsOptional()
  fullname: string;

  @ApiProperty({ example: "123456" })
  @Length(5, 100)
  @IsOptional()
  password: string;

  @ApiProperty({ example: "Quang Tu" })
  @IsPhoneNumber("VN")
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: "Example description" })
  @Length(1, 1000)
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  bio: string;

  @ApiProperty({
    example:
      "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png",
  })
  @Length(1, 1000)
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  avatar: string;
}
