import { Module } from '@nestjs/common';
import { BalanceService } from './service/balance.service';
import { BalanceController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity])],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
