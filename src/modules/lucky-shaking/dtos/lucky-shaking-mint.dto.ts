import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsNotEmpty, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class LuckyShakingMint {
  @ApiProperty({
    required: true,
  })
  @IsPositive()
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  toUserId: number;
}

export class LuckyShakingList {
  @ApiProperty({
    required: true,
    default: [],
    description: "list user ids",
  })
  @IsArray()
  @IsDefined({ each: true })
  @Type(() => Array<number>)
  ids: number[];
}
