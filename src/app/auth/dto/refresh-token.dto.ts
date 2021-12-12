import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class RefreshTokenDTO {
  @ApiProperty({ example: "totally-not-real-token" })
  @Length(1, 500)
  @IsNotEmpty()
  refreshToken: string;
}
