import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards';
import { Request } from 'express';

@Controller('player')
export class PlayerController {
  @UseGuards(AuthGuard)
  @Post('play')
  async play(@Req() request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    console.log(type, token);
  }
}
