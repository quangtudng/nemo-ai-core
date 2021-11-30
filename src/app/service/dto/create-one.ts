import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export class CreateServiceDto {
  @ApiProperty({ example: "Example title" })
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Example description" })
  @IsString()
  @Length(1, 1000)
  @IsOptional()
  description: string;

  @ApiProperty({ example: "Example url" })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  originUrl: string;

  @ApiProperty({ example: "Example full address" })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  fullAddress: string;

  @ApiProperty({ example: "Example phone number" })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: "Example thumbnail" })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  thumbnail: string;

  @ApiProperty({ type: Number, example: 5, required: false })
  @Min(1)
  @Max(100)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsNotEmpty()
  locationId: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  serviceImageUrls: string[];

  @ApiProperty({ example: [1, 2, 3] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  serviceAmenities: number[];
}
