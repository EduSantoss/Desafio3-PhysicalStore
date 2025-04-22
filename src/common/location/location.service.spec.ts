import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('LocationService', () => {
  let service: LocationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('deve retornar os dados do endereço quando o CEP for válido', async () => {
    const mockCep = '01001000';
    const mockData = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
    };

    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {} as any,
      config: { headers: {} as any },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getAddressByCep(mockCep);

    expect(result).toEqual(mockData);
  });

  it('deve retornar null quando o CEP não for encontrado', async () => {
    const mockCep = '00000000';
    const mockResponse: AxiosResponse = {
      data: { erro: true },
      status: 200,
      statusText: 'OK',
      headers: {} as any,
      config: { headers: {} as any },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getAddressByCep(mockCep);

    expect(result).toBeNull();
  });

  it('deve retornar null em caso de erro na requisição', async () => {
    const mockCep = '99999999';

    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw new Error('Erro na requisição');
    });

    const result = await service.getAddressByCep(mockCep);

    expect(result).toBeNull();
  });
});
5