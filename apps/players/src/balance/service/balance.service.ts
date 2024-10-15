import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerEntity } from '../../player/entities';
import { Repository } from 'typeorm';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>,
  ) {}

  async getBalance(username: string) {
    const player = await this.playerRepository.findOne({
      where: {
        username,
      },
    });

    if (!player) {
      throw new Error('ERR_TODO');
    }

    const balance = player.balance;

    return balance;
  }

  async replenishBalance(username: string, count: number) {
    const player = await this.playerRepository.findOne({ where: { username } });

    if (!player) {
      throw new Error('ERR_TODO');
    }

    player.balance = Number(player.balance) + Number(count);

    await this.playerRepository.save(player);

    return player.balance;
  }
}
