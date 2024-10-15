import { NestFactory } from '@nestjs/core';
import { PlayersModule } from './players.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PlayersModule, {
    logger: ['error', 'log'],
  });

  app.enableCors({
    origin: 'http://localhost:5173',
  });

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

  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        bearerFormat: 'jwt',
        description: 'jwt',
        in: 'header',
        name: 'jwt',
        scheme: 'bearer',
        type: 'http',
      },
      'jwt-auth',
    )
    .setDescription('REST API')
    .setTitle('REST API')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  await app.listen(8787);
}
bootstrap();
