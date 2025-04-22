import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MelhorEnvioService {
  private readonly logger = new Logger(MelhorEnvioService.name);
  private readonly apiUrl = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';

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
      // this.logger.debug('Enviando payload para MelhorEnvio:', {  //// log para ver o retorno /////
      //   originCep,
      //   destinationCep,
      //   token,
      // });      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/calculator`,
          {
            from: { postal_code: originCep },
            to: { postal_code: destinationCep },
            products: [
              {
                id: 1,
                width: 15,
                height: 10,
                length: 20,
                weight: 1,  
                insurance_value: 0,  
                quantity: 1,
              },
            ],
            options: {
              receipt: false,
              own_hand: false,
              insurance_value: 0,
              reverse: false, 
              non_commercial: true
            },
            services: ['1', '2'], // vazio = traz todos, ou especificar ['1', '2'] para sedex e pac.
            validate: true
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

      const allowedServices = ['PAC', 'SEDEX'];
      const services = response.data;
      
      const filteredServices = services.filter((s: any) =>
        allowedServices.includes(s.name.toUpperCase()),
      );
      
      return filteredServices.map((s: any) => ({
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
