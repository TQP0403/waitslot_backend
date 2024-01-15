import { Injectable, Logger } from "@nestjs/common";
import { KycPhoneService } from "./use-cases/kyc-phone.service";
import { KycMailService } from "./use-cases/kyc-mail.service";
import { KycInterface } from "./use-cases/kyc.interface";
import { VerificationsService } from "@modules/verifications/verifications.service";
import { ValidatorHelper } from "@helpers/index";
import { AppError, ERROR_CODE } from "@configs/index";
import { CacheService } from "@modules/cache/cache.service";
import { isDefined } from "class-validator";

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  private readonly kycPhone: KycInterface;
  private readonly kycMail: KycInterface;

  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly cacheService: CacheService,
  ) {
    this.kycMail = new KycMailService(this.logger);
    this.kycPhone = new KycPhoneService(this.logger);
  }

  private async _setCacheUsername(
    username: string,
    token: string,
  ): Promise<void> {
    const key = `kyc:${username}`;
    await this.cacheService.set(key, token, 60);
  }

  private async _getCacheUsername(username: string): Promise<string> {
    const key = `kyc:${username}`;
    const token = await this.cacheService.get(key);
    return token;
  }

  public async send(username: string) {
    // TODO: cache username -> check too many request
    const token = await this._getCacheUsername(username);
    if (isDefined(token)) {
      throw new AppError(ERROR_CODE.TOO_MANY_REQUESTS, "try again after 60s");
    }

    // check username is email or phone
    if (ValidatorHelper.validateEmail(username)) {
      const verification =
        await this.verificationsService.createVerification(username);

      await this._setCacheUsername(username, verification.token);

      return this.kycMail.send(username, verification.token);
    } else if (ValidatorHelper.validatePhone(username)) {
      const verification =
        await this.verificationsService.createVerification(username);

      await this._setCacheUsername(username, verification.token);

      return this.kycPhone.send(username, verification.token);
    }

    throw new AppError(
      ERROR_CODE.BAD_REQUEST,
      "Username must be email or phone number",
    );
  }

  public async verify(username: string, token: string, isDelete?: boolean) {
    await this.verificationsService.checkVerification(
      username,
      token,
      isDelete || true,
    );
    return true;
  }

  public async check(username: string, token: string) {
    return this.verificationsService.verifyVerification(username, token);
  }
}
