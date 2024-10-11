import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { PlayService } from '../services';

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
    @Inject('PLAYERS_MICROSERVICE')
    private readonly playersMicroserviceClientKafka: ClientKafka,
    @Inject() private readonly playService: PlayService,
  ) {}

  private connections: Map<WebSocket, string> = new Map<WebSocket, string>();

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('auth')
  async handleAuthMessage(client: WebSocket, @MessageBody() authToken: string) {
    this.connections.set(client, authToken);

    this.playersMicroserviceClientKafka.emit('PLAYER_AUTHORIZED', {});
  }

  @SubscribeMessage('open')
  async handleOpenMessage(
    client: WebSocket,
    @MessageBody() coords: { x: number; y: number },
  ) {
    this.playService.tryToOpenCell(
      coords.x,
      coords.y,
      this.connections.get(client) || 'undefined',
    );
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
