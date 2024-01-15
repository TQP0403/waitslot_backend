import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transactions } from "./domain/transactions.entity";
import { MissionsModule } from "@modules/missions/missions.module";
import { UserModule } from "@modules/user/user.module";
import { TransactionsController } from "./transactions.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions]),
    UserModule,
    MissionsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
