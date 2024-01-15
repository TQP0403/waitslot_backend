import { Module } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "./domain/cards.entity";
import { FileModule } from "@modules/file/file.module";
import { CardsController } from "./cards.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Cards]), FileModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardModule {}
