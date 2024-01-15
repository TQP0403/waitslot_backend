import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class LoginDto {
  @ApiProperty({
    required: true,
    description: "required email or phone number of user",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  username: string;

  @ApiProperty({
    required: true,
    description: "verify email token",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  verifyToken: string;
}
