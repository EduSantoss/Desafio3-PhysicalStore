import { ApiProperty } from '@nestjs/swagger';
import { StoreDto } from './store.dto';

export class FindStoresResponseDto {
  @ApiProperty({ type: [StoreDto] })
  stores: StoreDto[];

  @ApiProperty({ description: 'Número total de lojas encontradas' })
  total: number;
}
