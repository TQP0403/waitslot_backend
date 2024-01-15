import { Charset, generate } from "randomstring";
import { RANDOM_LENGTH } from "../configs/constant";

export class RandomHelper {
  public static generate(length?: number, charset?: Charset): string {
    return generate({
      charset,
      length: length || RANDOM_LENGTH,
    });
  }
}
