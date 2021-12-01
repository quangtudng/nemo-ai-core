import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

export class UpdateServiceDTO {
  @ApiProperty({ example: "Example title" })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  title: string;

  @ApiProperty({ example: "Example description" })
  @IsString()
  @Length(1, 1000)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  description: string;

  @ApiProperty({ example: "Example url" })
  @IsString()
  @Length(1, 200)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  originUrl: string;

  @ApiProperty({ example: "Example full address" })
  @IsString()
  @Length(1, 200)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  fullAddress: string;

  @ApiProperty({ example: "Example phone number" })
  @IsString()
  @Length(1, 200)
  @ValidateIf((object, value) => value !== null && value !== "")
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: "Example thumbnail" })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  thumbnail: string;

  @ApiProperty({ type: Number, example: 5, required: false })
  @Min(0)
  @Max(1000000000)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  locationId: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  serviceImageUrls: string[];

  @ApiProperty()
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  serviceAmenities: number[];
}
