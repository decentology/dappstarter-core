import { Module } from '@nestjs/common';
import { DappController } from './dapp.controller';
import { DappService } from './dapp.service';

@Module({
  controllers: [DappController],
  providers: [DappService],
})
export class DappModule {}