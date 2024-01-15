import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./domain/user.entity";
import { UserService } from "./user.service";
import { CacheModule } from "@modules/cache/cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), CacheModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
