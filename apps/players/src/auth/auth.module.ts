import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module';
import { AuthService } from './services';
import { AuthController } from './controllers';

@Module({
  controllers: [AuthController],
  imports: [PlayerModule],
  providers: [AuthService],
})
export class AuthModule {}
