import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PlayService {
  private readonly PLAY_FIELD_HEIGHT = 1000;
  private readonly PLAY_FIELD_WIDTH = 1000;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.fillPlayField();
  }

  async fillPlayField() {
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

    const buffer = Buffer.from(cells);

    const value = buffer.toString('hex');

    await this.cacheManager.set('PLAY_FIELD', value, { ttl: 0 });
  }

  async getPlayField(offset: number, cellsCount: number) {
    const value = await this.cacheManager.store.get<string>('PLAY_FIELD');

    const buffer = Buffer.from(value, 'hex');

    const subArray = buffer.subarray(offset, offset + cellsCount);

    const playFieldCells = subArray.toJSON().data;

    return playFieldCells;
  }

  async openCell(x: number, y: number) {
    let isCoinFound = false;

    if (
      x >= 0 &&
      x < this.PLAY_FIELD_WIDTH &&
      y >= 0 &&
      y < this.PLAY_FIELD_HEIGHT
    ) {
      const value = await this.cacheManager.store.get<string>('PLAY_FIELD');

      const buffer = Buffer.from(value, 'hex');

      const isNotZero = buffer[y * this.PLAY_FIELD_HEIGHT + x] !== 0;

      if (isNotZero) {
        isCoinFound = true;

        buffer[y * this.PLAY_FIELD_HEIGHT + x] = 0;

        const value = buffer.toString('hex');

        await this.cacheManager.set('PLAY_FIELD', value, { ttl: 0 });
      }
    }

    return isCoinFound;
  }
}
