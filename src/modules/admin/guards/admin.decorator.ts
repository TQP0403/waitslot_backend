import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AdminPermission, AdminRole } from "../admin.enum";
import { JwtAdminGuard } from "./jwt-admin.guard";
import { AdminRolePermissionGuard } from "./admin-role-permission.guard";

export const PERMISSIONS_KEY = "permission";
export const ROLES_KEY = "role";

type AuthGuardType = {
  role: AdminRole;
  permission: AdminPermission;
};

export function AdminGuard(param: AdminPermission | AdminRole | AuthGuardType) {
  const decorators: Array<MethodDecorator & ClassDecorator> = [];
  decorators.push(ApiBearerAuth());
  if (typeof param === "number") {
    decorators.push(SetMetadata(PERMISSIONS_KEY, param));
  } else if (typeof param === "string") {
    decorators.push(SetMetadata(ROLES_KEY, param));
  } else if (typeof param === "object") {
    decorators.push(SetMetadata(ROLES_KEY, param.role));
    decorators.push(SetMetadata(PERMISSIONS_KEY, param.permission));
  }
  decorators.push(UseGuards(JwtAdminGuard, AdminRolePermissionGuard));

  return applyDecorators(...decorators);
}
