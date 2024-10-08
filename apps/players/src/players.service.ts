import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  getHello(): string {
    return 'Hello World!';
  }
}
