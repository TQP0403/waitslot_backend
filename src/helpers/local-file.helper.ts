import { AppError, ERROR_CODE } from "@configs/index";
import * as fs from "fs";
import * as path from "path";

export class LocalFileHelper {
  public static read(file: string) {
    const _path = path.join(process.cwd(), "public", file);
    try {
      return fs.readFileSync(_path, { encoding: "utf-8" });
    } catch (e) {
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
