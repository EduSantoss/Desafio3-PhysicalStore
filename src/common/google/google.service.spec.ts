import { GoogleService } from './google.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleService', () => {
  let service: GoogleService;

  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = 'fake-api-key';
    service = new GoogleService();
  });

  it('deve retornar a distância em km se a API responder corretamente', async () => {
    const origin = '01001000';
    const destination = '20040030';

    const mockDistance = 12345; // 12.345 metros => 12.345 km
    mockedAxios.get.mockResolvedValue({
      data: {
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'OK',
                distance: { value: mockDistance },
              },
            ],
          },
        ],
      },
    });

    const result = await service.getDistanceFromMatrix(origin, destination);
    expect(result).toBe(mockDistance / 1000);
  });

  it('deve lançar erro se a resposta da API não for OK', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        status: 'INVALID_REQUEST',
        rows: [],
      },
    });

    await expect(
      service.getDistanceFromMatrix('01001000', '20040030'),
    ).rejects.toThrow('Erro ao calcular distância pelo Google Maps');
  });

  it('deve lançar erro se a requisição falhar', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Erro de rede'));

    await expect(
      service.getDistanceFromMatrix('01001000', '20040030'),
    ).rejects.toThrow('Erro ao consultar distância no Google Maps');
  });
});
