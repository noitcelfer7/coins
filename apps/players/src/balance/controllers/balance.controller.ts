import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { BalanceService } from '../service/balance.service';

@Controller()
export class BalanceController {
  constructor(@Inject() private readonly balanceService: BalanceService) {}

  @EventPattern('COIN_FOUND')
  async onCoinFound(data: { username: string }) {
    await this.balanceService.replenish(data.username, 1);
  }
}
