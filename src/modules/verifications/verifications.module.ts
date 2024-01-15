import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Verifications } from "./domain/verifications.entity";
import { VerificationsService } from "./verifications.service";

@Module({
  imports: [TypeOrmModule.forFeature([Verifications])],
  controllers: [],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
