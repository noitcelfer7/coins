import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { PlayService } from '../services';
import { MessageEnum } from '../enums';
import {
  FindRequestDto,
  OpenRequestDto,
  PlayFieldResponseDto,
  StartGameRequestDto,
} from '../dtos';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(9999, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(WebSocketGateway.name);

  private connections: Map<
    WebSocket,
    { username: string; active: boolean; count: number }
  > = new Map<
    WebSocket,
    { username: string; active: boolean; count: number }
  >();

  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject('PLAYERS_MICROSERVICE')
    private readonly playersMicroserviceClientKafka: ClientKafka,
    @Inject() private readonly playService: PlayService,
  ) {}

  handleDisconnect(webSocket: WebSocket) {
    const info = this.connections.get(webSocket);

    if (info) {
      this.playersMicroserviceClientKafka.emit('PLAYER_DISCONNECTED', {
        username: info.username,
        count: info.count,
      });
    }
  }

  @SubscribeMessage(MessageEnum.REQUEST_START_GAME)
  async onRequestStartGame(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() startGameRequestDto: StartGameRequestDto,
  ) {
    const isTokenValid = this.jwtService.verify(
      startGameRequestDto.accessToken,
    );

    if (!isTokenValid) {
      webSocket.close();

      this.logger.warn(`(!isTokenValid) [${startGameRequestDto.accessToken}]`);

      return;
    }

    const { username } = this.jwtService.decode(
      startGameRequestDto.accessToken,
    );

    if (!username) {
      webSocket.close();

      this.logger.warn(`(!username) [${username}]`);

      return;
    }

    this.connections.set(webSocket, {
      username,
      active: true,
      count: 0,
    });
  }

  @SubscribeMessage(MessageEnum.REQUEST_CHANGE_QUAD)
  async onRequestPlayField(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() findRequestDto: FindRequestDto,
  ) {
    const isTokenValid = this.jwtService.verify(findRequestDto.accessToken);

    if (!isTokenValid) {
      webSocket.close();

      this.logger.warn(`(!isTokenValid) [${findRequestDto.accessToken}]`);

      return;
    }

    const { username } = this.jwtService.decode(findRequestDto.accessToken);

    if (!username) {
      webSocket.close();

      this.logger.warn(`(!username) [${username}]`);

      return;
    }

    const playField = await this.playService.getPlayField(
      findRequestDto.offset,
      1000,
    );

    const playFieldResponseDto: PlayFieldResponseDto = {
      message: 'PLAY_FIELD',
      playField,
    };

    webSocket.send(JSON.stringify(playFieldResponseDto));
  }

  @SubscribeMessage(MessageEnum.REQUEST_OPEN_CELL)
  async onRequestOpenCell(
    @ConnectedSocket() webSocket: WebSocket,
    @MessageBody() openRequestDto: OpenRequestDto,
  ) {
    const isTokenValid = this.jwtService.verify(openRequestDto.accessToken);

    if (!isTokenValid) {
      webSocket.close();

      this.logger.warn(`(!isTokenValid) [${openRequestDto.accessToken}]`);

      return;
    }

    const { username } = this.jwtService.decode(openRequestDto.accessToken);

    if (!username) {
      webSocket.close();

      this.logger.warn(`(!username) [${username}]`);

      return;
    }

    const isCoinFound = await this.playService.openCell(
      openRequestDto.x,
      openRequestDto.y,
    );

    if (isCoinFound) {
      this.playersMicroserviceClientKafka.emit('COIN_FOUND', {
        x: openRequestDto.x,
        y: openRequestDto.y,
        username,
      });

      const info = this.connections.get(webSocket);

      if (info) {
        this.connections.set(webSocket, { ...info, count: info.count + 1 });
      }
    }

    this.logger.log(
      `(isCoinFound) [${{
        x: openRequestDto.x,
        y: openRequestDto.y,
        username,
      }}]`,
    );
  }
}
