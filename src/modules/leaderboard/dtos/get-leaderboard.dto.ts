import { ListDto } from "@helpers/dto.helper";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { LeaderboardType } from "@modules/user/interfaces/leaderboard.enum";
import { Type } from "class-transformer";

export class GetLeaderboardDto extends ListDto {
  @ApiProperty({
    required: false,
    default: LeaderboardType.REFERRAL,
    enum: LeaderboardType,
  })
  @IsOptional()
  @IsEnum(LeaderboardType)
  @Type(() => Number)
  type?: LeaderboardType;
}
