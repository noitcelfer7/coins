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

  async replenish(username: string, count: number) {
    const player = await this.playerRepository.findOne({ where: { username } });

    if (!player) {
      throw new Error('Player does not exists');
    }

    player.balance = Number(player.balance) + Number(count);

    await this.playerRepository.save(player);
  }
}
