// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class DistanceService {
//   constructor(private readonly httpService: HttpService) {}

//   async getDistanceBetween(origin: string, destinations: string[]): Promise<{ destination: string, distanceInKm: number }[]> {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//     const destStr = destinations.join('|');

//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

//     const response = await firstValueFrom(
//       this.httpService.get(url, {
//         params: {
//           origins: origin,
//           destinations: destStr,
//           key: apiKey,
//         },
//       }),
//     );

//     const data = response.data;

//     return data.rows[0].elements.map((element, idx) => ({
//       destination: destinations[idx],
//       distanceInKm: element.status === 'OK' ? element.distance.value / 1000 : Infinity,
//     }));
//   }
// }
