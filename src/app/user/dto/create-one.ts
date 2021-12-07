import { Role } from "@app/role/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  ValidateIf,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Quang Tu", nullable: false })
  @Length(5, 50)
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: "example@gmail.com", nullable: false })
  @IsEmail()
  @Length(5, 100)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "123456", nullable: false })
  @Length(5, 100)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: "+84928701036", nullable: false })
  @IsPhoneNumber("VN")
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: "Example description" })
  @Length(1, 1000)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  bio: string;

  @ApiProperty({ example: "Example url" })
  @Length(1, 1000)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: 0, nullable: false })
  @IsIn([0, 1])
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @ApiProperty({ example: 2, nullable: false })
  @IsNotIn([1])
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  role: Role;
}
