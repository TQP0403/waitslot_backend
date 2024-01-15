import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class ParamId {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id!: number;
}

export class ListDto {
  @ApiProperty({ required: false, type: Number, default: 1 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, type: Number, default: 10 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  pageSize?: number;
}

export type ListModel<T> = {
  total: number;
  rows: T[];
};
