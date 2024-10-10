import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [ConsumerModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
