import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { AdminPermission, AdminRole } from "../admin.enum";
import { AdminLoginDto } from "./admin-login.dto";

export class AdminRegisterDto extends AdminLoginDto {
  @ApiProperty({
    required: true,
    description: "admin display name",
  })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @Type(() => String)
  fullname: string;

  @ApiProperty({
    required: false,
    description: "optional description",
  })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  description: string;

  @ApiProperty({
    required: true,
    description: "admin role",
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  @IsEnum(AdminRole)
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  role: AdminRole;

  @ApiProperty({
    required: false,
    description: "admin permissions",
    enum: AdminPermission,
    isArray: true,
    default: [],
  })
  @IsEnum(AdminPermission, { each: true })
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Array<Number>)
  permissions: AdminPermission[];
}
