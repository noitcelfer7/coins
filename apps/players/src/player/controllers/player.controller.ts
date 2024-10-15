import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('player')
export class PlayerController {
  @EventPattern('PLAYER_STARTED')
  async onPlayerStarted() {
    console.log('Пользователь начал игру.');
  }
}
