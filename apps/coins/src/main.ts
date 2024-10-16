import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'warn'],
  });

  app.useWebSocketAdapter(new WsAdapter(app));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'redis',
      port: 6379,
    },
  });

  await app.startAllMicroservices();

  await app.listen(7878);
}
bootstrap();
