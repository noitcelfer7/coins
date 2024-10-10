import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>,
  ) {}

  async createPlayer(password: string, username: string) {
    const foundPlayer = await this.playerRepository.findOne({
      where: {
        username,
      },
    });

    if (foundPlayer) {
      throw new Error('Player salready exists');
    }

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const playerInstance = this.playerRepository.create({
      password: passwordHash,
      username,
    });

    const createdPlayer = await this.playerRepository.save(playerInstance);

    return createdPlayer;
  }

  async findPlayerByUsername(username: string) {
    const foundPlayer = await this.playerRepository.findOne({
      where: {
        username,
      },
    });

    return foundPlayer;
  }
}
