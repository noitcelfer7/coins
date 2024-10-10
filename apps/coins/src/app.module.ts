import { Module } from '@nestjs/common';
import { PlayModule } from './play/play.module';

@Module({
  imports: [PlayModule],
})
export class AppModule {}
