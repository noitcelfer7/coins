import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class PlayService {
  private readonly PLAY_FIELD_HEIGHT = 1000;
  private readonly PLAY_FIELD_WIDTH = 1000;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('PLAYERS_MICROSERVICE')
    private readonly playersMicroserviceClientKafka: ClientKafka,
  ) {
    this.fillPlayField();
  }

  async fillPlayField() {
    this.playersMicroserviceClientKafka.emit('PLAY_FIELD_FILLING', {});

    const cells = new Uint8Array(
      this.PLAY_FIELD_HEIGHT * this.PLAY_FIELD_WIDTH,
    );

    for (
      let i: number = 0;
      i < this.PLAY_FIELD_HEIGHT * this.PLAY_FIELD_WIDTH;
      ++i
    ) {
      cells[i] = 1;
    }

    const value = Buffer.from(cells).toString('hex');

    await this.cacheManager.set('PLAY_FIELD', value, { ttl: 0 });

    this.playersMicroserviceClientKafka.emit('PLAY_FIELD_FILLED', {});
  }

  async getPlayFieldCells(offset: number, cellsCount: number) {
    const result = await this.cacheManager.store.get<string>('PLAY_FIELD');

    const playField = Buffer.from(result, 'hex');

    const cells = playField.subarray(offset, offset + cellsCount);

    return cells.toString('hex');
  }

  async tryToOpenCell(x: number, y: number, username: string) {
    let isOk = false;

    if (
      x >= 0 &&
      x < this.PLAY_FIELD_WIDTH &&
      y >= 0 &&
      y < this.PLAY_FIELD_HEIGHT
    ) {
      const kk = await this.cacheManager.store.get<string>('PLAY_FIELD');

      const playField = Buffer.from(kk, 'hex');

      const isCoinFound = playField[y * this.PLAY_FIELD_HEIGHT + x] !== 0;

      if (isCoinFound) {
        isOk = true;

        this.playersMicroserviceClientKafka.emit('COIN_FOUND', {
          x,
          y,
          username,
        });
      }
    }

    return isOk;
  }
}
