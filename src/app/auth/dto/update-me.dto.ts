import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateMeDTO {
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
}
