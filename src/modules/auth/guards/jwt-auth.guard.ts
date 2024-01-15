import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { AppError, ERROR_CODE } from "@configs/index";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      let token = req.headers["x-access-token"];

      if (!token) {
        const bearerToken = req.headers.authorization
          ? req.headers.authorization.split(" ")
          : [];
        if (bearerToken.length < 1) return false;

        token = bearerToken[1];
        if (!token) return false;
      }
      req.token = token;
      req.user = this.jwtService.verify(token);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }
  }
}
