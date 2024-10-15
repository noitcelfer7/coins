import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { SignInRequestDto, SignInResponseDto, SignUpRequestDto } from '../dtos';
import { AuthService } from '../services';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Вход и регистрация.')
@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authSerice: AuthService) {}

  @ApiBearerAuth('jwt-auth')
  @ApiBody({
    type: SignInRequestDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера.' })
  @ApiOkResponse({ description: 'Ок.', type: SignInResponseDto })
  @ApiOperation({ summary: 'Вход.' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    const signInResponseDto = await this.authSerice.signIn(signInRequestDto);

    return signInResponseDto;
  }

  @ApiBearerAuth('jwt-auth')
  @ApiBody({
    type: SignUpRequestDto,
  })
  @ApiCreatedResponse({ description: 'Ок.' })
  @ApiInternalServerErrorResponse({ description: 'Внутренняя ошибка сервера.' })
  @ApiOperation({ summary: 'Регистрация.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    await this.authSerice.signUp(signUpRequestDto);
  }
}
