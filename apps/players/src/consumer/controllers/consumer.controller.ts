import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  @EventPattern('COIN_FOUND')
  async onCoinFound() {
    console.log('PLAY_FIELD_FILLED');
  }

  @EventPattern('PLAY_FIELD_FILLED')
  async onPlayFieldFilled() {
    console.log('PLAY_FIELD_FILLED');
  }

  @EventPattern('PLAY_FIELD_FILLING')
  async onPlayFieldFilling() {
    console.log('PLAY_FIELD_FILLING');
  }
}
