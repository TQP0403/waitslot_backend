import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { UploadOptionalDto } from "@helpers/upload.dto.helper";
import { LoginDto } from "./login.dto";

export class RegisterDto extends IntersectionType(LoginDto, UploadOptionalDto) {
  @ApiProperty({
    required: true,
    description: "referral unique name can not be changed",
  })
  @IsDefined()
  @IsNotEmpty()
  @Length(8, 32)
  @Type(() => String)
  refName: string;

  @ApiProperty({
    required: false,
    description: "display name can be edited in the future",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  fullname: string;

  @ApiProperty({
    required: false,
    description: "optional referral code",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  refCode: string;

  @ApiProperty({
    required: false,
    description: "optional user bio",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  bio: string;
}
