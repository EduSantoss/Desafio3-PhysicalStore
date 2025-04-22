// src/stores/interfaces/store-response.interface.ts
import { TipoLojas } from '../schemas/store.schema';

export interface StoreResponse {
  storeID: string;
  storeName: string;
  takeOutInStore: boolean;
  shippingTimeInDays: number;
  latitude: string;
  longitude: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  district: string;
  state: string;
  type: TipoLojas;
  country: string;
  postalCode: string;
  telephoneNumber: string;
  emailAddress: string;
  distanceKm: number;
  shippingCost: number;
}
