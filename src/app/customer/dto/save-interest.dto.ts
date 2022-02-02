import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Length } from "class-validator";

export class SaveInterestDto {
  @ApiProperty({ example: "LongID" })
  @Length(1, 1000)
  @IsNotEmpty()
  customerLongId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  interestId: number;
}
