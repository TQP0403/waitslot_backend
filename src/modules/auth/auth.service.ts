import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isDefined, isEmpty } from "class-validator";
import { LoginResponse } from "./auth.interfaces";
import { LoginDto } from "./dtos/login.dto";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { KycService } from "@modules/kyc/kyc.service";
import { MissionsService } from "@modules/missions/missions.service";
import { FileService } from "@modules/file/file.service";
import { MetadataService } from "@modules/metadata/metadata.service";
import { AppError, DEFAULT_BIO, ERROR_CODE, env } from "@configs/index";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "@modules/user/user.service";
import { IUserResponse } from "@modules/user/interfaces/user.interface";
import { User } from "@modules/user/domain/user.entity";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly whitelist: string[] = [];

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly metadataService: MetadataService,
    private readonly fileService: FileService,
    private readonly kycService: KycService,
    private readonly missionsService: MissionsService,
    private readonly userService: UserService,
  ) {
    this.whitelist.push("dongnqdev@gmail.com");
  }

  private _getToken(userId: number): LoginResponse {
    const payload = { userId: userId };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: env.auth.accessTokenExpireTime,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: env.auth.refreshTokenExpireTime,
      }),
    };
  }

  public async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const data: any = this.jwtService.verify(refreshToken);

    if (isDefined(data?.userId)) {
      const userId = data?.userId;
      const user = await this.userService.getUserById(userId);
      if (isDefined(user)) {
        return this._getToken(userId);
      }
    }

    throw new AppError(ERROR_CODE.UNAUTHORIZED);
  }

  public async login(params: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.getUserByUsername(params.username);

    if (!isDefined(user)) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }

    // whitelist dev account
    if (this.whitelist.includes(params.username)) {
      return this._getToken(user.id);
    }

    await this.kycService.verify(params.username, params.verifyToken);

    return this._getToken(user.id);
  }

  public async register(
    params: RegisterDto,
    file?: Express.Multer.File,
  ): Promise<LoginResponse> {
    let refUser: User;

    if (!isEmpty(params.refCode)) {
      refUser = await this.userService.getUserByRefName(params.refCode);

      if (!isDefined(refUser)) {
        throw new AppError(ERROR_CODE.NOT_FOUND, "Invalid referral code");
      }
    }

    await Promise.all([
      this.userService.checkExistUsername(params.username),
      this.userService.checkExistRefName(params.refName),
    ]);
    await this.kycService.verify(params.username, params.verifyToken);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("READ COMMITTED");
    let avatar: string;
    const bio: string = params.bio || DEFAULT_BIO;
    try {
      const metadata = await this.metadataService.get();

      if (isDefined(file)) {
        avatar = await this.fileService.upload(file);
      }

      const user = await this.userService.createUser(
        params.refName,
        params.fullname,
        params.username,
        metadata.totalWaitingSlot,
        refUser?.id,
        bio,
        avatar,
      );

      if (isDefined(refUser)) {
        await this.userService.incRefCount(refUser);

        // join wait list mission reward
        await this.missionsService.doMissionReferral(refUser.id);
      }

      // increase total waiting slot
      await this.metadataService.updateTotalWaitingSlot(metadata);

      // join wait list mission reward
      await this.missionsService.doMissionJoinWaitlist(user.id);

      await queryRunner.commitTransaction();

      return this._getToken(user.id);
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  public async getProfile(id: number): Promise<IUserResponse> {
    const [user, metadata] = await Promise.all([
      this.userService.getUserById(id),
      this.metadataService.get(60_000),
    ]);

    return user.getResponse(metadata.totalWaitingSlot);
  }

  public async editProfile(
    id: number,
    file?: Express.Multer.File,
    fullname?: string,
    bio?: string,
  ) {
    try {
      let avatar: string;
      if (isDefined(file)) {
        // upload avatar
        avatar = await this.fileService.upload(file);
      }

      await this.userService.updateUserProfile(id, fullname, avatar, bio);

      return;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async checkKyc(username: string, token: string) {
    try {
      const data = await this.kycService.check(username, token);
      return { data };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async sendKyc(username: string) {
    try {
      return await this.kycService.send(username);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async checkUsername(name: string) {
    try {
      const data = await this.userService.isExistUsername(name);
      return { data: !data };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async checkRefName(name: string) {
    try {
      const data = await this.userService.isExistRefName(name);
      return { data: !data };
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
