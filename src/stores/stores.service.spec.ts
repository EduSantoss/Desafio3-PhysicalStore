import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './stores.service';
import { getModelToken } from '@nestjs/mongoose';
import { GoogleService } from '../common/google/google.service';
import { MelhorEnvioService } from 'src/common/melhorenvio/melhorenvio.service';
import { LocationService } from 'src/common/location/location.service';
import { Store } from './schemas/store.schema';

describe('StoreService', () => {
  let service: StoreService;
  let mockStoreModel: any;

  beforeEach(async () => {
    mockStoreModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getModelToken(Store.name),
          useValue: mockStoreModel,
        },
        {
          provide: GoogleService,
          useValue: {
            getDistanceFromMatrix: jest.fn().mockResolvedValue(10),
          },
        },
        {
          provide: MelhorEnvioService,
          useValue: {
            getFreightValue: jest.fn().mockResolvedValue([
              {
                prazo: '3 dias úteis',
                price: 'R$ 22,00',
                description: 'PAC',
              },
            ]),
          },
        },
        {
          provide: LocationService,
          useValue: {
            getAddressByCep: jest.fn().mockResolvedValue({
              cep: '12345678',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return stores and total', async () => {
    const result = await service.findAll();
    expect(result).toEqual({ stores: [], total: 0 });
    expect(mockStoreModel.find).toHaveBeenCalled();
  });

  it('findStoreById should return a store if found', async () => {
    const mockStore = { _id: '1', name: 'Loja A' };
    mockStoreModel.findById.mockResolvedValue(mockStore);

    const result = await service.findStoreById('1');
    expect(result).toEqual(mockStore);
  });

  it('findStoreById should throw if store not found', async () => {
    mockStoreModel.findById.mockResolvedValue(null);
    await expect(service.findStoreById('999')).rejects.toThrow(
      'Loja com ID 999 não encontrada',
    );
  });

  it('findStoresByState should return filtered stores and total', async () => {
    const mockStores = [{ uf: 'PE', name: 'Loja PE' }];
    mockStoreModel.find.mockReturnValue({ lean: () => mockStores });

    const result = await service.findStoresByState('pe');
    expect(result).toEqual({ stores: mockStores, total: mockStores.length });
  });

  it('findStoresByCep should return ordered stores with distance and value', async () => {
    const mockStores = [
      {
        name: 'Loja 1',
        cep: '11111111',
        localidade: 'Cidade 1',
        latitude: -8.0,
        longitude: -34.9,
      },
    ];
    mockStoreModel.find.mockReturnValue({ lean: () => mockStores });

    const result = await service.findStoresByCep('12345-678');

    expect(result.stores[0]).toHaveProperty('type', 'PDV');
    expect(result.stores[0].value[0].description).toBe('Motoboy');
    expect(result.total).toBe(1);
  });
});
