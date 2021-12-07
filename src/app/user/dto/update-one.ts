import { Role } from "@app/role/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  ValidateIf,
} from "class-validator";

export class UpdateUserDTO {
  @ApiProperty({ example: "Quang Tu", required: false })
  @Length(5, 50)
  @IsOptional()
  fullname: string;

  @ApiProperty({ example: "123456", required: false })
  @Length(5, 100)
  @IsOptional()
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
  @IsOptional()
  status: number;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsNotIn([1])
  @IsNumber()
  @IsOptional()
  roleId: number;

  role: Role;
}
