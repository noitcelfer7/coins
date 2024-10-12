import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { PlayService } from '../services';
import { MessageEnum } from '../enums';
import { FindRequestDto, OpenRequestDto, PlayRequestDto } from '../dtos';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(9999, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject('PLAYERS_MICROSERVICE')
    private readonly playersMicroserviceClientKafka: ClientKafka,
    @Inject() private readonly playService: PlayService,
  ) {}

  private connections: Map<WebSocket, string> = new Map<WebSocket, string>();

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage(MessageEnum.FIND)
  async onFindMessage(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() findRequestDto: FindRequestDto,
  ) {
    const playFieldCells = await this.playService.getPlayFieldCells(
      findRequestDto.offset,
      1000,
    );

    webSocket.send(JSON.stringify({ cells: playFieldCells }), (err) =>
      console.log('An error occured: ', err),
    );
  }

  @SubscribeMessage(MessageEnum.OPEN)
  async onOpenMessage(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() openRequestDto: OpenRequestDto,
  ) {
    const username = this.connections.get(webSocket);

    if (!username) {
      webSocket.close();

      return;
    }

    const isOk = await this.playService.tryToOpenCell(
      openRequestDto.x,
      openRequestDto.y,
      username,
    );

    if (isOk) {
      for (const [k] of this.connections) {
        k.send(JSON.stringify(openRequestDto), (err) =>
          console.log('An error occured: ', err),
        );
      }
    } else {
      webSocket.send(JSON.stringify(false));
    }
  }

  @SubscribeMessage(MessageEnum.PLAY)
  async onPlayMessage(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() playRequestDto: PlayRequestDto,
  ) {
    console.log(process.env);
    const isTokenValid = this.jwtService.verify(playRequestDto.accessToken);

    if (!isTokenValid) {
      webSocket.close();

      return;
    }

    const { username } = this.jwtService.decode(playRequestDto.accessToken);

    if (!username) {
      webSocket.close();

      return;
    }

    this.connections.set(webSocket, username);

    this.playersMicroserviceClientKafka.emit('PLAYER_STARTED', { username });
  }

  async handleConnection(client: WebSocket) {
    this.connections.set(client, '');

    this.playersMicroserviceClientKafka.emit('PLAYER_CONNECTED', {});
  }

  async handleDisconnect(client: WebSocket) {
    this.connections.delete(client);

    this.playersMicroserviceClientKafka.emit('PLAYER_DISCONNECTED', {});
  }
}
