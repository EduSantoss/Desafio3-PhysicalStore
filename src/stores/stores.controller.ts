import { Controller, Get } from '@nestjs/common';
import { StoreService } from './stores.service';
//import { Store } from './schemas/store.schema';

@Controller('api/stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAllStores() {
    return this.storeService.findAll();
  }
}
