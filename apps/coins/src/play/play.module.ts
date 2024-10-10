import { Module } from '@nestjs/common';
import { PlayService } from './services';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CacheModule.register({
      host: 'localhost',
      port: 6379,
      store: redisStore,
    }),
    ClientsModule.register([
      {
        name: 'PLAYERS_MICROSERVICE',
        options: {
          client: {
            brokers: ['localhost:19092'],
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
  providers: [PlayService],
})
export class PlayModule {}
