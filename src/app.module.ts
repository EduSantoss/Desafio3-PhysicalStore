import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from './stores/stores.module';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("Variável de ambiente MONGO_URI não definida!");
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    StoreModule,
  ],
})
export class AppModule {}
