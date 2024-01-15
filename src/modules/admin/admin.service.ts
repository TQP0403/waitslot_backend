import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isDefined } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppError, ERROR_CODE, env } from "@configs/index";
import { AdminRegisterDto } from "./dtos/admin-register.dto";
import { LoginResponse } from "@modules/auth/auth.interfaces";
import { AdminLoginDto } from "./dtos/admin-login.dto";
import { Admin } from "./domain/admin.entity";
import { BcryptHelper } from "@helpers/bcrypt.helper";
import { CacheService } from "@modules/cache/cache.service";
import { AdminChangePasswordDto } from "./dtos/admin-change-password.dto";
import { plainToClass } from "class-transformer";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  public async getAdminById(id: number): Promise<Admin> {
    try {
      let admin = await this._getCacheAdmin(id);

      if (admin === null) {
        admin = await this.repo.findOne({ where: { id } });
        await this._setCacheAdmin(admin);
      }

      return admin;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getAdminByUsername(username: string): Promise<Admin> {
    try {
      return this.repo.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async isExistUsername(username: string): Promise<boolean> {
    try {
      return this.repo.exist({ where: { username } });
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private _getToken(id: number): LoginResponse {
    const payload = { id };

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
    if (isDefined(data?.id)) {
      const admin = await this.getAdminById(data.id);

      if (!isDefined(admin) || !admin.enable) {
        throw new AppError(ERROR_CODE.UNAUTHORIZED);
      }
      return this._getToken(admin.id);
    }
  }

  public async login(params: AdminLoginDto): Promise<LoginResponse> {
    const admin = await this.getAdminByUsername(params.username);

    if (!isDefined(admin) || !admin.enable) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }

    const check = await BcryptHelper.compare(params.password, admin.password);

    if (!check) {
      throw new AppError(
        ERROR_CODE.UNAUTHORIZED,
        "Username or Password is incorrect",
      );
    }

    return this._getToken(admin.id);
  }

  public async register(params: AdminRegisterDto): Promise<LoginResponse> {
    const check = await this.isExistUsername(params.username);

    if (check) {
      throw new AppError(ERROR_CODE.CONFLICT, "Username registered");
    }

    try {
      const admin = new Admin();
      admin.fullname = params.fullname;
      admin.description = params.description;
      admin.username = params.username;
      admin.password = await BcryptHelper.generateHash(params.password);
      admin.role = params.role;
      admin.permissions = params.permissions;
      admin.enable = true;

      await admin.save();

      return this._getToken(admin.id);
    } catch (e) {
      this.logger.error(e);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async getProfile(id: number): Promise<Admin> {
    const admin = await this.getAdminById(id);
    delete admin.password;

    return admin;
  }

  public async changePassword(
    id: number,
    params: AdminChangePasswordDto,
  ): Promise<void> {
    const admin = await this.getAdminById(id);

    const check = await BcryptHelper.compare(
      params.oldPassword,
      admin.password,
    );

    if (!check) {
      throw new AppError(
        ERROR_CODE.UNAUTHORIZED,
        "Username or Password is incorrect",
      );
    }

    try {
      const hashPassword = await BcryptHelper.generateHash(params.newPassword);
      admin.password = hashPassword;

      await admin.save();
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  private async _getCacheAdmin(id: number): Promise<Admin | null> {
    const key = `admin:${id.toString()}`;
    const rawData = await this.cacheService.get(key);
    if (!isDefined(rawData)) return null;
    return plainToClass(Admin, rawData);
  }

  private async _setCacheAdmin(admin: Admin): Promise<void> {
    const key = `admin:${admin.id.toString()}`;
    if (isDefined(admin)) {
      await this.cacheService.set(key, admin, 300);
    }
  }
}
