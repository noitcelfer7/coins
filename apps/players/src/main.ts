import { NestFactory } from '@nestjs/core';
import { PlayersModule } from './players.module';

async function bootstrap() {
  const app = await NestFactory.create(PlayersModule);
  await app.listen(3000);
}
bootstrap();
