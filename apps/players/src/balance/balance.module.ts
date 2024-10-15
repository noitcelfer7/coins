import { Module } from '@nestjs/common';
import { BalanceService } from './service/balance.service';
import { BalanceController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/entities';

@Module({
  controllers: [BalanceController],
  imports: [TypeOrmModule.forFeature([PlayerEntity])],
  providers: [BalanceService],
})
export class BalanceModule {}
