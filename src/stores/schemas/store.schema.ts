import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

export enum TipoLojas {
  PDV = 'PDV',
  LOJA = 'LOJA'
};

@Schema()
export class Store {
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cep: string;

  @Prop({ default: true })
  takeOutInStore: boolean;

  @Prop({ required: true })
  shippingTimeInDays: number;

  @Prop({ required: true })
  latitude: string;

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  address1: string;

  @Prop()
  address2?: string;

  @Prop()
  address3?: string;

  @Prop({ required: true })
  localidade: string;

  @Prop({ required: true })
  bairro: string;

  @Prop({ required: true })
  uf: string;

  @Prop({ required: true, enum: TipoLojas })
  type: TipoLojas; 

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  telephoneNumber: string;

  @Prop({ required: true })
  emailAddress: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
