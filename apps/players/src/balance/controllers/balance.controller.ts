import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BalanceService } from '../service/balance.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards';
import { EventPattern, Payload } from '@nestjs/microservices';

@ApiTags('Баланс.')
@Controller('balance')
export class BalanceController {
  constructor(@Inject() private readonly balanceService: BalanceService) {}

  @ApiBearerAuth('jwt-auth')
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера.' })
  @ApiOkResponse({ description: 'Ок.' })
  @ApiOperation({ summary: 'Получить баланс пользователя. ' })
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getBalance(@Param('username') username: string) {
    const balance = await this.balanceService.getBalance(username);

    return balance;
  }

  @EventPattern('COIN_FOUND')
  async replenishBalance(
    @Payload() payload: { x: number; y: number; username: string },
  ) {
    await this.balanceService.replenishBalance(payload.username, 1);
  }
}
