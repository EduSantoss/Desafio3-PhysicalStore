import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { StoreModule } from './store/store.module'; // novo módulo para stores

@Module({
  imports: [
    MongooseModule.forRoot('string de conexao'),
   // StoreModule,
  ],
})
export class AppModule {}
