import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY;

   async getDistanceFromMatrix(origin: string, destination: string): Promise<number> {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: origin,
          destinations: destination,
          key: this.apiKey,
        },
      });

      const data = response.data;

      if (data.status !== 'OK' || data.rows[0].elements[0].status !== 'OK') {
        this.logger.error('Erro na resposta da API Distance Matrix', data);
        throw new Error('Erro ao calcular distância pelo Google Maps');
      }

      const distanceInMeters = data.rows[0].elements[0].distance.value;
      const distanceInKm = distanceInMeters / 1000;

      return distanceInKm;
    } catch (error) {
      this.logger.error('Erro na chamada à API do Google Distance Matrix', error);
      throw new Error('Erro ao consultar distância no Google Maps');
    }
  }
}
