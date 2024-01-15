import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export class sendTxDTO {
  @ApiProperty({
    required: true,
    default: [],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsDefined({ each: true })
  @IsPositive({ each: true })
  @Type(() => Array<number>)
  toUserIds: number[];

  @ApiProperty({
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => Number)
  cardId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  description?: string;
}
