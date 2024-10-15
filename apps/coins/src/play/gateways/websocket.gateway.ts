import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { PlayService } from '../services';
import { MessageEnum } from '../enums';
import { FindRequestDto, OpenRequestDto, PlayFieldResponseDto } from '../dtos';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(9999, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway {
  private readonly logger = new Logger(WebSocketGateway.name);

  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject('PLAYERS_MICROSERVICE')
    private readonly playersMicroserviceClientKafka: ClientKafka,
    @Inject() private readonly playService: PlayService,
  ) {}

  private connections: Map<string, WebSocket> = new Map<string, WebSocket>();

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

    this.logger.log('');
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
