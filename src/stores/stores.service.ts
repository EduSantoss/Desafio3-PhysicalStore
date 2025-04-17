import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import axios from 'axios';

@Injectable()
export class StoreService {

    constructor(
        @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    ) {}
  async findAll(): Promise<{ stores: Store[]; total: number }> {
    const stores = await this.storeModel.find().exec();
    return {
      stores,
      total: stores.length,
    };
  }

  async getDistanceFromGoogleMaps(origin: string, destination: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

    const response = await axios.get(url, {
      params: {
        origins: origin,
        destinations: destination,
        key: apiKey,
      },
    });

    return response.data;
  }
}
