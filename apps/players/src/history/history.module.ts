import { Module } from '@nestjs/common';
import { HistoryService } from './services';
import { HistoryController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryRecordEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryRecordEntity])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
