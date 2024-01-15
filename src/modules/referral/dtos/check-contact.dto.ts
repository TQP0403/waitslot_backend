import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, MaxLength } from "class-validator";

export class CheckContactDto {
  @ApiProperty({
    required: true,
    default: [],
    description: "list contacts",
  })
  @IsArray()
  @IsDefined({ each: true })
  @MaxLength(255, { each: true })
  @Type(() => Array<String>)
  contacts: string[];
}
