import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class SendDto {
  @ApiProperty({
    required: true,
    description: "required email or phone number",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  username: string;
}
