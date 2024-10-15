import { Inject, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(WebSocketGateway.name);

  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject('PLAYERS_MICROSERVICE')
    private readonly playersMicroserviceClientKafka: ClientKafka,
    @Inject() private readonly playService: PlayService,
  ) {}

  private connections: Map<string, WebSocket> = new Map<string, WebSocket>();

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage(MessageEnum.FIND)
  async onFindMessage(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() findRequestDto: FindRequestDto,
  ) {
    const isTokenValid = this.jwtService.verify(findRequestDto.accessToken);

    if (!isTokenValid) {
      webSocket.close();

      return;
    }

    const { username } = this.jwtService.decode(findRequestDto.accessToken);

    if (!username) {
      webSocket.close();

      return;
    }
    this.connections.set(username, webSocket);
    const playFieldCells = await this.playService.getPlayFieldCells(
      findRequestDto.offset,
      1000,
    );

    this.logger.log(`Игрок ${username} запросил часть поля.`);

    webSocket.send(JSON.stringify({ event: 'FIND', cells: playFieldCells }));
  }

  @SubscribeMessage(MessageEnum.OPEN)
  async onOpenMessage(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() openRequestDto: OpenRequestDto,
  ) {
    const isTokenValid = this.jwtService.verify(openRequestDto.accessToken);

    if (!isTokenValid) {
      webSocket.close();

      return;
    }

    const { username } = this.jwtService.decode(openRequestDto.accessToken);

    if (!username) {
      webSocket.close();

      return;
    }
    this.connections.set(username, webSocket);
    const isOk = await this.playService.tryToOpenCell(
      openRequestDto.x,
      openRequestDto.y,
      username,
    );

    this.logger.log(
      `Игрок ${username} пытается открыть ячейку (${isOk} ${openRequestDto.x} ${openRequestDto.y})`,
    );

    if (isOk) {
      this.logger.log('Все хорошо. Отсылаем ответы...');
      for (const [, v] of this.connections) {
        v.send(
          JSON.stringify({
            event: 'OPEN_OK',
            x: openRequestDto.x,
            y: openRequestDto.y,
          }),
          (err) => console.log('An error occured: ', err),
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

    this.connections.set(username, webSocket);

    this.logger.log(`Игрок ${username} начал игру.`);

    this.playersMicroserviceClientKafka.emit('PLAYER_STARTED', { username });
  }

  async handleConnection(client: WebSocket) {
    this.logger.log('К серверу подключился игрок...');

    this.playersMicroserviceClientKafka.emit('PLAYER_CONNECTED', {});
  }

  async handleDisconnect(client: WebSocket) {
    let key;

    for (const [k, v] of this.connections) {
      if (v === client) {
        key = k;
        break;
      }
    }

    if (key) {
      this.connections.delete(key);
    }

    this.playersMicroserviceClientKafka.emit('PLAYER_DISCONNECTED', {});
  }
}
