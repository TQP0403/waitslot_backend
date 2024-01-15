import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength } from "class-validator";
import { Type } from "class-transformer";
import { UploadOptionalDto } from "@helpers/index";

export class EditProfileDto extends UploadOptionalDto {
  @ApiProperty({
    required: false,
    description: "optional email or phone number of user",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  fullname: string;

  @ApiProperty({
    required: false,
    description: "optional user bio",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  bio: string;
}
