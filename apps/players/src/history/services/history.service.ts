import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryRecordEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryRecordEntity)
    private readonly historyRecordEntityRepository: Repository<HistoryRecordEntity>,
  ) {}

  async addRecord(username: string, count: number) {
    const instance = this.historyRecordEntityRepository.create({
      count,
      username,
    });

    await this.historyRecordEntityRepository.save(instance);
  }

  async getHistoryOf(username: string) {
    const records = await this.historyRecordEntityRepository.find({
      where: {
        username,
      },
    });

    return records;
  }
}
