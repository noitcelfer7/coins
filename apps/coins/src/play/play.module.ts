import { Module } from '@nestjs/common';
import { PlayService } from './services';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WebsocketGateway } from './gateways';

@Module({
  imports: [
    CacheModule.register({
      host: 'redis',
      port: 6379,
      store: redisStore,
    }),
    ClientsModule.register([
      {
        name: 'PLAYERS_MICROSERVICE',
        options: {
          client: {
            brokers: ['redpanda:9092'],
            clientId: 'PLAYERS_CLIENT',
          },
          consumer: {
            groupId: 'PLAYERS_CONSUMER',
          },
        },
        transport: Transport.KAFKA,
      },
    ]),
  ],
  providers: [PlayService, WebsocketGateway],
})
export class PlayModule {}
