import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schemas/store.schema';
import { GoogleModule } from 'src/common/google/google.module';
import { StoreService } from './stores.service';
import { StoreController } from './stores.controller';
import { MelhorEnvioModule} from '../common/melhorenvio/melhorenvio.module';
import { LocationModule } from 'src/common/location/location.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    GoogleModule,
    MelhorEnvioModule,
    LocationModule
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
