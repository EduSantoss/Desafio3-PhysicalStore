import { ApiProperty } from '@nestjs/swagger';

export class StoreDto {
  @ApiProperty({ description: 'Nome da loja' })
  name: string;

  @ApiProperty({ description: 'Cidade da loja' })
  city: string;

  @ApiProperty({ description: 'CEP da loja' })
  postalCode: string;

  @ApiProperty({ description: 'Tipo da loja', enum: ['PDV', 'LOJA'] })
  type: string;

  @ApiProperty({ description: 'Distância da loja em km' })
  distanceKm: number;

  @ApiProperty({ description: 'Distância formatada da loja' })
  distance: string;

  @ApiProperty({ description: 'Valor de entrega ou frete da loja', type: [Object] })
  value: { prazo: string; price: string; description: string; codProdutoAgencia?: string }[];

  @ApiProperty({ description: 'Informações do pin para localização da loja' })
  pin: {
    position: {
      lat: number;
      lng: number;
    };
    title: string;
  };
}
