import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class AdminLoginDto {
  @ApiProperty({
    required: true,
    description: "admin username",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  username: string;

  @ApiProperty({
    required: true,
    description: "admin password",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  password: string;
}
