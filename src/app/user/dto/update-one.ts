import { Role } from "@app/role/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateUserDTO {
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
  @IsOptional()
  status: number;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsNumber()
  @IsNotIn([1])
  @IsOptional()
  roleId: number;

  role: Role;
}
