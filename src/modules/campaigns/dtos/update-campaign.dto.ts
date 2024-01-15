import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { UploadOptionalDto } from "@helpers/index";

export class UpdateCampaignDto extends UploadOptionalDto {
  @ApiProperty({
    required: false,
    description: "campaign title",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  title: string;

  @ApiProperty({
    required: false,
    description: "campaign description",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  description: string;

  @ApiProperty({
    required: false,
    description: "campaign priority from 1 to 5",
  })
  @IsOptional()
  @Max(5)
  @Type(() => Number)
  priority: number;

  @ApiProperty({
    required: true,
    description: "campaign is published",
    default: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Boolean)
  publish: Boolean;

  @ApiProperty({
    required: false,
    description: "campaign start time",
  })
  @IsOptional()
  @Type(() => Date)
  startTime?: Date;

  @ApiProperty({
    required: false,
    description: "campaign end time",
  })
  @IsOptional()
  @Type(() => Date)
  endTime?: Date;
}
