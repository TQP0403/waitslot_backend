import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class UploadOptionalDto {
  @ApiProperty({
    description: "upload image file",
    type: "string",
    format: "binary",
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  file: string;
}

export class UploadRequiredDto {
  @ApiProperty({
    description: "upload image file",
    type: "string",
    format: "binary",
    required: true,
  })
  @Type(() => String)
  file: string;
}
