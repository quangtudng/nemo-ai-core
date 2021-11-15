import { Role } from "@app/role/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateUserDTO {
  @ApiProperty({
    example: "example@gmail.com",
    required: false,
  })
  @MinLength(5)
  @MaxLength(100)
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: "123456", required: false })
  @MinLength(5)
  @MaxLength(100)
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ example: "Quang Tu", required: false })
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  firstname: string;

  @ApiProperty({ example: "Nguyen", required: false })
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  lastname: string;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsNumber()
  @IsNotIn([1])
  @IsOptional()
  roleId: number;

  role: Role;
}
