import { Role } from "@app/role/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "example@gmail.com", nullable: false })
  @MinLength(5)
  @MaxLength(100)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "123456", nullable: false })
  @MinLength(5)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: "Quang Tu", nullable: false })
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: "Quang Tu", nullable: false })
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: "Example description" })
  @IsString()
  @Length(1, 1000)
  @IsOptional()
  bio: string;

  @ApiProperty({ example: 0, nullable: false })
  @IsNumber()
  @IsIn([0, 1])
  @IsNotEmpty()
  status: number;

  @ApiProperty({ example: 2, nullable: false })
  @IsNumber()
  @IsNotIn([1])
  @IsNotEmpty()
  roleId: number;

  role: Role;
}
