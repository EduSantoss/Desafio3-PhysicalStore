import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument, TipoLojas } from './schemas/store.schema';
import { GoogleService } from '../common/google/google.service';
import { MelhorEnvioService } from 'src/common/melhorenvio/melhorenvio.service';
import { LocationService } from 'src/common/location/location.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly googleService: GoogleService,
    private readonly melhorEnvioService: MelhorEnvioService,
    private readonly locationService: LocationService,
  ) {}

  async findAll(): Promise<{ stores: Store[]; total: number }> {
    const stores = await this.storeModel.find().exec();
    return {
      stores,
      total: stores.length,
    };
  }

  async findStoreById(id: string): Promise<any> {
    const store = await this.storeModel.findById(id);
    if (!store) {
      throw new Error(`Loja com ID ${id} não encontrada`);
    }
    return store
  }

  async findStoresByState(state: string): Promise<any> {
    const stores = await this.storeModel
      .find({ uf: state.toUpperCase() })
      .lean();
    return {
      stores,
      total: stores.length,
    };
  }

  formatCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  async findStoresByCep(
    cep: string,
  ): Promise<{ stores: any[]; total: number }> {
    const userLocation = await this.locationService.getAddressByCep(cep);
    if (!userLocation) {
      throw new Error(`CEP inválido ou não encontrado: ${cep}`);
    }

    const stores = await this.storeModel.find().lean();

    const resultsWithDistance = await Promise.all(
      stores.map(async (store) => {
        const origin = this.formatCep(store.cep);
        const destination = this.formatCep(userLocation.cep);

        const distanceKm = await this.googleService.getDistanceFromMatrix(
          origin,
          destination,
        );
        const distanceFormatted = `${distanceKm.toFixed(1)} km`;

        const type = distanceKm <= 50 ? TipoLojas.PDV : TipoLojas.LOJA;
        const value: {
          prazo: string;
          price: string;
          description: string;
          codProdutoAgencia?: string;
        }[] = [];

        if (type === TipoLojas.PDV) {
          value.push({
            prazo: '1 dias úteis',
            price: 'R$ 15,00',
            description: 'Motoboy',
          });
        } else {
          const fretes = await this.melhorEnvioService.getFreightValue(
            store.cep,
            cep,
          );
          value.push(...fretes);
        }

        return {
          name: store.name,
          city: store.localidade,
          postalCode: store.cep,
          type,
          distanceKm,
          distance: distanceFormatted,
          value,
          pin: {
            position: {
              lat: store.latitude,
              lng: store.longitude,
            },
            title: store.name,
          },
        };
      }),
    );

    ///// Ordenar por distância //////
    const ordered = resultsWithDistance.sort(
      (a, b) => a.distanceKm - b.distanceKm,
    );

    // ///// Filtrar apenas as lojas PDVs (dentro de 50km)  //////
    // const pdvs = ordered.filter((store) => store.type === TipoLojas.PDV);
    return {
      stores: ordered.map(({ distanceKm, ...store }) => store),
      total: ordered.length,
    };
  }
}
