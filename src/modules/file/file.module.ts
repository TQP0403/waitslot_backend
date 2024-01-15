import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FilerController } from "./file.controller";
import { AdminModule } from "@modules/admin/admin.module";

@Module({
  imports: [AdminModule],
  controllers: [FilerController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
