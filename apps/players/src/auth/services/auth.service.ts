import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { SignInRequestDto, SignUpRequestDto } from '../dtos';
import { PlayerService } from '../../player/services/player.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly playerService: PlayerService,
    @Inject() private readonly jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto) {
    const foundPlayer = await this.playerService.findPlayerByUsername(
      signInRequestDto.username,
    );

    if (!foundPlayer) {
      throw new Error('ERR_TODO');
    }

    const passwordMatches = await bcrypt.compare(
      signInRequestDto.password,
      foundPlayer.password,
    );

    if (!passwordMatches) {
      throw new Error('Password does not matches');
    }

    const payload = {
      username: signInRequestDto.username,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async signUp(signUpRequestDto: SignUpRequestDto) {
    await this.playerService.createPlayer(
      signUpRequestDto.password,
      signUpRequestDto.username,
    );
  }
}
