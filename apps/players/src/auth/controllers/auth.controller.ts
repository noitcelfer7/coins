import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignInRequestDto, SignUpRequestDto } from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authSerice: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    const object = await this.authSerice.signIn(signInRequestDto);

    return object;
  }

  @Post('sign-up')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    await this.authSerice.signUp(signUpRequestDto);
  }
}
