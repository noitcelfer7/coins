import { Controller, Inject } from '@nestjs/common';
import { HistoryService } from '../services';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class HistoryController {
  constructor(@Inject() private readonly historyService: HistoryService) {}

  @EventPattern('PLAYER_DISCONNECTED')
  async replenishBalance(
    @Payload() payload: { count: number; username: string },
  ) {
    await this.historyService.addRecord(
      payload.username,
      Number(payload.count),
    );
  }
}
