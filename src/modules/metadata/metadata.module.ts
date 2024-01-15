import { Module } from "@nestjs/common";
import { MetadataService } from "./metadata.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metadata } from "./domain/metadata.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Metadata])],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
