import { Injectable, Logger } from "@nestjs/common";
import { IUserResponse } from "@modules/user/interfaces/user.interface";
import { UserService } from "@modules/user/user.service";
import { ListDto, ListModel } from "@helpers/index";
import { MissionsService } from "@modules/missions/missions.service";

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    private readonly userService: UserService,
    private readonly missionsService: MissionsService,
  ) {}

  public async listReferral(
    userId: number,
    requestQuery?: ListDto,
  ): Promise<ListModel<IUserResponse>> {
    const { rows, total } = await this.userService.getListReferral(
      userId,
      requestQuery?.page,
      requestQuery?.pageSize,
    );

    return {
      total: total,
      rows: rows.map((value) => value.getResponse()),
    };
  }

  public async checkContact(phones: string[]) {
    const data = await this.userService.getListPhone();
    const result: any[] = [];
    for (let i = 0; i < phones.length; i++) {
      result.push({
        phone: phones[i],
        check: data.includes(phones[i]),
      });
    }

    return result;
  }

  public async checkFirstShare(userId: number) {
    const data = await this.missionsService.checkDoMissionFirstShare(userId);
    return { data };
  }

  public async doFirstShare(userId: number) {
    return this.missionsService.doMissionFirstShare(userId);
  }
}
