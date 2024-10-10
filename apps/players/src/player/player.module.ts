import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from './entities';
import { PlayerService } from './services/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity])],
  exports: [PlayerService],
  providers: [PlayerService],
})
export class PlayerModule {}
