import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MelhorEnvioService {
  private readonly logger = new Logger(MelhorEnvioService.name);
  private readonly apiUrl = 'https://www.melhorenvio.com.br/api/v2';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  //service: 'sedex' | 'pac'
  async getFreightValue(originCep: string, destinationCep: string): Promise<
  {
    prazo: string;
    price: string;
    description: string;
    codProdutoAgencia: string;
  }[]
  > {
    const token = this.configService.get<string>('MELHORENVIO_API_TOKEN');

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/calculator`,
          {
            from: { postal_code: originCep },
            to: { postal_code: destinationCep },
            products: [
              {
                weight: 1, 
                width: 11, 
                height: 17, 
                length: 20, 
                quantity: 1,
              },
            ],
            services: ['1', '2'], // vazio = traz todos, ou especificar ['1', '2'] para sedex e pac.
            options: {
              own_hand: false,
              receipt: false,
              insurance_value: 0,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
      );

      const services = response.data;
      return services.map((s: any) => ({
        prazo: `${s.delivery_time} dias úteis`,
        price: `R$ ${parseFloat(s.price).toFixed(2).replace('.', ',')}`,
        description: s.name,
        codProdutoAgencia: s.company.id,
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar frete via MelhorEnvio: ${error.message}`);
      return [];
    }
  }
}
