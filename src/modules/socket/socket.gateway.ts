import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { ISocketPayload } from "./socket.interface";
import { SocketService } from "./socket.service";
import { PayloadValidationPipe } from "./pipes/payload.pipe";

@WebSocketGateway({
  cors: true,
  // cors: { origin: "*", allowedHeaders: "*" },
  transports: ["websocket", "polling"],
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly service: SocketService) {}

  @SubscribeMessage("join")
  async handleJoin(
    @ConnectedSocket()
    client: Socket,
    @MessageBody(new PayloadValidationPipe())
    payload: ISocketPayload<any>,
  ): Promise<void> {
    return this.service.handleJoin(this.server, client, payload);
  }

  afterInit(server: Server) {
    this.logger.debug(`Socket.io connected: ${server.path()}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Connected ${client.id}`);
    // console.log(`Connected ${client.id}`);
    // Do stuffs
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Disconnected: ${client.id}`);
    // console.log(`Disconnected: ${client.id}`);
    // Do stuffs
  }
}
