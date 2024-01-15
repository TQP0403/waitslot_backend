import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Verifications } from "./domain/verifications.entity";
import { Injectable, Logger } from "@nestjs/common";
import { isDefined } from "class-validator";
import { AppError, ERROR_CODE, env } from "@configs/index";
import { RandomHelper } from "@helpers/index";

@Injectable()
export class VerificationsService {
  private readonly logger = new Logger(VerificationsService.name);

  constructor(
    @InjectRepository(Verifications)
    private readonly repo: Repository<Verifications>,
  ) {}

  public async isExistVerification(username: string): Promise<boolean> {
    try {
      const check = await this.repo.exist({ where: { username } });
      return check;
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async createVerification(username: string): Promise<Verifications> {
    const now = new Date();

    const verification = new Verifications();
    verification.username = username;
    verification.token = RandomHelper.generate(6, "numeric");

    verification.expireTime = new Date(now.getTime() + env.smtp.expire);

    try {
      // delete old tokens
      await this.repo.delete({ username });
      // save new token
      await this.repo.insert(verification);
      return verification;
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async checkVerification(
    username: string,
    token: string,
    isDelete?: boolean,
  ): Promise<void> {
    const verification = await this.repo.findOne({
      where: { username, token },
    });

    if (!isDefined(verification)) {
      throw new AppError(ERROR_CODE.NOT_FOUND, "token not found");
    }

    if (verification.expireTime < new Date()) {
      // delete expired token
      await this.repo.delete({ id: verification.id });
      throw new AppError(ERROR_CODE.SERVICE_UNAVAILABLE, "token expired");
    }

    if (isDelete === true) {
      // delete token
      await this.repo.delete({ id: verification.id });
    }

    return;
  }

  public async verifyVerification(
    username: string,
    token: string,
  ): Promise<boolean> {
    const verification = await this.repo.findOne({
      where: { username, token },
    });

    if (!isDefined(verification) || verification?.expireTime < new Date()) {
      return false;
    }

    return true;
  }
}
