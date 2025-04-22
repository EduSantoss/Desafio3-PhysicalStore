import { Test, TestingModule } from '@nestjs/testing';
import { MelhorEnvioService } from './melhorenvio.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';


describe('MelhorEnvioService', () => {
  let service: MelhorEnvioService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MelhorEnvioService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake_token'),
          },
        },
      ],
    }).compile();

    service = module.get<MelhorEnvioService>(MelhorEnvioService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('deve retornar fretes filtrados (PAC e SEDEX)', async () => {
    const mockResponse: AxiosResponse = {
        data: [
          {
            name: 'SEDEX',
            delivery_time: 2,
            price: '20.5',
            company: { id: '123' },
          },
          {
            name: 'PAC',
            delivery_time: 5,
            price: '12.3',
            company: { id: '456' },
          },
        ],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders (),
        },
      };

    jest.spyOn(httpService, 'post').mockReturnValueOnce(of( mockResponse ));

    const result = await service.getFreightValue('12345678', '87654321');

    expect(result).toEqual([
      {
        prazo: '5 dias úteis',
        price: 'R$ 23,45',
        description: 'PAC',
        codProdutoAgencia: '123',
      },
      {
        prazo: '2 dias úteis',
        price: 'R$ 30,10',
        description: 'SEDEX',
        codProdutoAgencia: '321',
      },
    ]);
  });

  it('deve retornar lista vazia em caso de erro', async () => {
    jest.spyOn(httpService, 'post').mockImplementation(() => {
      throw new Error('Erro de API');
    });

    const result = await service.getFreightValue('00000000', '99999999');
    expect(result).toEqual([]);
  });
});
