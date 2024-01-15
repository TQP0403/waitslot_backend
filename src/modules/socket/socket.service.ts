import { Injectable, Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { ISocketPayload, JoinRoom } from "./socket.interface";
import { env } from "@configs/environment-variable";
import { isDefined } from "class-validator";
import { CacheService } from "@modules/cache/cache.service";
import { CampaignsService } from "@modules/campaigns/campaigns.service";
import { MissionsService } from "@modules/missions/missions.service";
import { error } from "console";

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private readonly section: number = env.socket.roomSection;

  constructor(
    private readonly cacheService: CacheService,
    private readonly campaignsService: CampaignsService,
    private readonly missionsService: MissionsService,
  ) {
    // TODO: cache list room members with Redis ElastiCache
  }

  async _setCacheMember(room: string, members: number[]): Promise<void> {
    await this.cacheService.set(room, { members }, this.section);
  }

  async _getCacheMember(room: string): Promise<number[]> {
    const rawData = await this.cacheService.get(room);
    if (!isDefined(rawData)) return [];
    const cacheData = JSON.parse(rawData);
    return cacheData.members ?? [];
  }

  async handleJoin(
    server: Server,
    client: Socket,
    payload: ISocketPayload<any>,
  ): Promise<void> {
    if (!isDefined(payload.data)) {
      this.logger.error(`HANDLE EVENT: join: payload.data not found`);
      return;
    }
    const { id, campaignId } = payload.data;

    if (!isDefined(id)) return;

    if (isDefined(campaignId)) {
      /* TODO
      - Do mission lucky shaking
      - Join campaign participants
      */
      this.campaignsService
        .joinCaimpaign(id, campaignId)
        .then(() => {
          this.logger.debug(
            `Join participants list campaign-${campaignId} : user-${id}`,
          );
        })
        .catch((error) => {
          this.logger.error(`Join participants list campaign error:`);
          this.logger.error(error);
        });
      this.missionsService
        .doMissionShaking(id)
        .then(() => {
          this.logger.debug(`Do mission shaking user-${id}`);
        })
        .catch((error) => {
          this.logger.error(`Do mission shaking error:`);
          this.logger.error(error);
        });
    }

    const now = new Date();
    const roomId = Math.floor(now.getTime() / 1000 / this.section);
    const room = `socket:room:${roomId}`;

    const tempMembers = await this._getCacheMember(room);

    if (tempMembers.includes(id)) return;

    client.join(room);

    const startTime = roomId * this.section;
    const endTime = startTime + this.section;

    tempMembers.push(id);

    const data = {
      userId: id,
      roomId,
      section: this.section,
      startTime,
      endTime,
      members: tempMembers,
    };

    const p: ISocketPayload<JoinRoom> = { data };

    server.to(room).emit("join_room", p);

    await this._setCacheMember(room, tempMembers);

    this.logger.debug(`EMIT_EVENT: join_room: ${p.data.roomId} : ${id}`);
  }
}
