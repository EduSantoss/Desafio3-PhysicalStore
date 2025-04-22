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

  private formatCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  async findStoresByCep(cep: string, raio: number): Promise<{ stores: any[]; pins: any[]; total: number }>{
    const userLocation = await this.locationService.getAddressByCep(cep);
    if (!userLocation) {
      throw new Error(`CEP inválido ou não encontrado: ${cep}`);
    }

    const stores = await this.storeModel.find().lean();
    const results: any[] = [];
    const pins: any[] = [];

  for (const store of stores) {
    const origin = `${store.latitude},${store.longitude}`;
    const destination = this.formatCep(userLocation.cep);

    const distanceKm = await this.googleService.getDistanceFromMatrix(origin, destination);
    const distanceFormatted = `${distanceKm.toFixed(1)} km`;

    const type = distanceKm <= 50 ? TipoLojas.PDV : TipoLojas.LOJA;
    const value: {
      prazo: string;
      price: string;
      description: string;
      codProdutoAgencia?: string
    }[] = [];

    if (type === 'PDV') {
      value.push({
        prazo: '1 dias úteis',
        price: 'R$ 15,00',
        description: 'Motoboy',
      });
    } else {
      const fretes = await this.melhorEnvioService.getFreightValue(store.postalCode, cep);
      value.push(...fretes);
    }

    results.push({
      name: store.storeName,
      city: store.city,
      postalCode: store.postalCode,
      type,
      distance: distanceFormatted,
      value,
    });

    pins.push({
      position: {
        lat: store.latitude,
        lng: store.longitude,
      },
      title: store.storeName,
    });
  }

  return {
    stores: results,
    pins,
    total: results.length,
  };
}

  // descartado devido a mudança de lógica, decidi utilziar um calculo de apenas um percurso por vez !! 

  // async getDistanceFromGoogleMaps(origin: string, destination: string) {
  //   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  //   const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

  //   const response = await axios.get(url, {
  //     params: {
  //       origins: origin,
  //       destinations: destination,
  //       key: apiKey,
  //     },
  //   });

  //   return response.data;
  // }
}
