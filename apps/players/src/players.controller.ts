import { Controller, Get } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  getHello(): string {
    return this.playersService.getHello();
  }
}
