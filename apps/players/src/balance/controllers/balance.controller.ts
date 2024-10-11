import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { BalanceService } from '../service/balance.service';

@Controller()
export class BalanceController {
  constructor(@Inject() private readonly balanceService: BalanceService) {}

  @EventPattern('COIN_FOUND')
  async onCoinFound(data: { x: number; y: number; username: string }) {
    await this.balanceService.replenish(data.username, 1);
  }
}
