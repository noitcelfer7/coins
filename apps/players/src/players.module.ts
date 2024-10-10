import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { BalanceModule } from './balance/balance.module';
import typeormConfig from './config/typeorm/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => typeormConfig],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    TypeOrmModule.forRoot(typeormConfig.options),
    AuthModule,
    PlayerModule,
    BalanceModule,
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
