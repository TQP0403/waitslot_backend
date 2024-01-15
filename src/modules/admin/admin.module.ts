import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Admin } from "./domain/admin.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@modules/cache/cache.module";
import { AdminRolePermissionGuard } from "./guards/admin-role-permission.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), CacheModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRolePermissionGuard],
  exports: [AdminService],
})
export class AdminModule {}
