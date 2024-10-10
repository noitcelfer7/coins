import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(9999, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('greeting')
  async handleGreetingMessage() {
    return 'Hello!';
  }
}
