import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './stores.service';

@Controller('api/stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAllStores() {
    return this.storeService.findAll();
  }

  @Get('by-cep/:cep')
  async getStoresByCep(
    @Param('cep') cep: string,
    @Query('radius') radius?: string,
  ) {
    const raio = radius ? parseInt(radius) : 100;
    return this.storeService.findStoresByCep(cep, raio);
  }
}
