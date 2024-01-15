import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsPositive, Max } from "class-validator";
import { Type } from "class-transformer";
import {
  DayDataFilterEnum,
  DayDataRankingEnum,
} from "../interfaces/user-day-data.enum";

export class TopRankFilterDto {
  @ApiProperty({ required: false, type: Number, default: 10 })
  @IsOptional()
  @IsPositive()
  @Max(1000)
  @Type(() => Number)
  pageSize?: number;

  @ApiProperty({
    required: false,
    default: DayDataRankingEnum.TOP,
    enum: DayDataRankingEnum,
  })
  @IsOptional()
  @IsEnum(DayDataRankingEnum)
  @Type(() => Number)
  ranking?: DayDataRankingEnum;

  @ApiProperty({
    required: false,
    default: DayDataFilterEnum.ALL,
    enum: DayDataFilterEnum,
  })
  @IsOptional()
  @IsEnum(DayDataFilterEnum)
  @Type(() => Number)
  filter?: DayDataFilterEnum;
}
