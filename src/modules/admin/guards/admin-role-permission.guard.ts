import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdminPermission, AdminRole } from "../admin.enum";
import { PERMISSIONS_KEY, ROLES_KEY } from "./admin.decorator";
import { AdminService } from "../admin.service";

@Injectable()
export class AdminRolePermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<AdminRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermission =
      this.reflector.getAllAndOverride<AdminPermission>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    const req = context.switchToHttp().getRequest();

    const admin = await this.adminService.getProfile(req.admin.id);

    if (admin.role === AdminRole.SUPER_ADMIN) return true;

    const checkRole = !requiredRole || requiredRole === admin.role;
    const checkPermission =
      !requiredPermission || admin.permissions?.includes(requiredPermission);

    return checkRole && checkPermission;
  }
}
