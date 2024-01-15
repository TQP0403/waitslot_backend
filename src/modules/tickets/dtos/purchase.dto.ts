import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class PurchaseDTO {
  @ApiProperty({
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  campaignId: number;

  @ApiProperty({
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
}
