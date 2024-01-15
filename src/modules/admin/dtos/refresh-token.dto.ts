import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class RefreshTokenDto {
  @ApiProperty({
    required: true,
    description: "Refresh token",
  })
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  refreshToken: string;
}
