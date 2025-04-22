import { Module } from '@nestjs/common';
import { MelhorEnvioService } from './melhorenvio.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MelhorEnvioService],
  exports: [MelhorEnvioService],
})
export class MelhorEnvioModule {}
