import * as bcrypt from "bcrypt";
import { env } from "../configs";

export class BcryptHelper {
  static async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(env.auth.bcryptRounds);
    return bcrypt.hash(password, salt);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
