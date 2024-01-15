import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LuckyBox } from "./domain/lucky-boxes.entity";
import { LuckyBoxesService } from "./lucky-boxes.service";

@Module({
  imports: [TypeOrmModule.forFeature([LuckyBox])],
  controllers: [],
  providers: [LuckyBoxesService],
  exports: [LuckyBoxesService],
})
export class LuckyBoxesModule {}
