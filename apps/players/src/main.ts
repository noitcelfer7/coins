import { NestFactory } from '@nestjs/core';
import { PlayersModule } from './players.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PlayersModule);

  app.connectMicroservice<MicroserviceOptions>({
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
  });

  await app.startAllMicroservices();

  await app.listen(8787);
}
bootstrap();
