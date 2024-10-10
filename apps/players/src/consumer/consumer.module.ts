import { Module } from '@nestjs/common';
import { ConsumerController } from './controllers';

@Module({
  controllers: [ConsumerController],
})
export class ConsumerModule {}
