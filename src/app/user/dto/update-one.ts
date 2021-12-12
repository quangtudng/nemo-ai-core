import { Role } from "@app/role/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  ValidateIf,
} from "class-validator";

export class UpdateUserDTO {
  @ApiProperty({ example: "Quang Tu" })
  @Length(5, 50)
  @IsOptional()
  fullname: string;

  @ApiProperty({ example: "123456" })
  @Length(5, 100)
  @IsOptional()
  password: string;

  @ApiProperty({ example: "+84928701036" })
  @IsPhoneNumber("VN")
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: "A hardworking employee with a good heart" })
  @Length(1, 1000)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  bio: string;

  @ApiProperty({
    example:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
  })
  @Length(1, 1000)
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== "")
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: 0 })
  @IsIn([0, 1])
  @IsNumber()
  @IsOptional()
  status: number;

  @ApiProperty({ example: [2, 3] })
  @IsNotIn([1])
  @IsNumber()
  @IsOptional()
  roleId: number;

  role: Role;
}
