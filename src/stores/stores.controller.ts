import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './stores.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { StoreDto } from './dtos/store.dto';
import { FindStoresResponseDto } from './dtos/store.response.dto';

@ApiTags('Lojas')
@Controller('api/stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as lojas' })
  @ApiResponse({ status: 200, description: 'Lista de lojas retornada com sucesso', type: FindStoresResponseDto })
  async getAllStores() {
    return this.storeService.findAll();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Busca loja por ID' })
  @ApiParam({ name: 'id', description: 'ID da loja' })
  @ApiResponse({ status: 200, description: 'Loja encontrada com sucesso', type: StoreDto })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  async getStoreById(@Param('id') id: string) {
    return this.storeService.findStoreById(id);
  }

  @Get('state/:uf')
  @ApiOperation({ summary: 'Lista lojas por estado (UF)' })
  @ApiParam({ name: 'uf', description: 'UF do estado, ex: SP, RJ, PE' })
  @ApiResponse({ status: 200, description: 'Lojas do estado retornadas com sucesso', type: FindStoresResponseDto })
  async getStoresByState(@Param('uf') uf: string) {
    return this.storeService.findStoresByState(uf);
  }

  @Get('cep/:cep')
  @ApiOperation({ summary: 'Lista lojas ordenadas por distância com base no CEP' })
  @ApiParam({ name: 'cep', description: 'CEP de destino para cálculo da distância e frete' })
  @ApiResponse({ status: 200, description: 'Lojas ordenadas por proximidade', type: FindStoresResponseDto })
  async getStoresByCep(
    @Param('cep') cep: string,
  ) {
    return this.storeService.findStoresByCep(cep);
  }
}
