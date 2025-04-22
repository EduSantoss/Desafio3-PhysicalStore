import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private readonly httpService: HttpService) {}

  async getAddressByCep(cep: string): Promise<{
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
  } | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`)
      );

      if (response.data?.erro) {
        this.logger.warn(`CEP ${cep} não encontrado na API ViaCEP`);
        return null;
      }

      const { cep: cleanCep, logradouro, complemento, bairro, localidade, uf } = response.data;

      return {
        cep: cleanCep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar o CEP ${cep}: ${error.message}`);
      return null;
    }
  }
}
