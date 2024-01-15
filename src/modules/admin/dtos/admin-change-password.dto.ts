import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class AdminChangePasswordDto {
  @ApiProperty({
    required: true,
    description: "admin old password",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  oldPassword: string;

  @ApiProperty({
    required: true,
    description: "admin new password",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  newPassword: string;
}
