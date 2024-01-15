import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { DayDataFilterEnum } from "../interfaces/user-day-data.enum";

export class UserDayDataFilterDto {
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
