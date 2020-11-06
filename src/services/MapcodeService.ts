import axios, { AxiosInstance } from 'axios';
import * as AxiosLogger from 'axios-logger';

type LatLon = [number, number];

export interface IMapcodeService {
  convertLocationToMapcode(location: LatLon): Promise<Mapcode>;
}

export class MapcodeService implements IMapcodeService {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.mapcode.com/mapcode',
    });
    this.client.interceptors.response.use(AxiosLogger.responseLogger);
    this.client.interceptors.request.use(AxiosLogger.requestLogger);
  }

  async convertLocationToMapcode(location: LatLon) {
    const response = await this.client.get<Mapcode>(`/codes/${location.join(',')}`);
    return response.data;
  }
}

export interface Mapcode {
  international: International;
  local: Local;
  mapcodes: Local[];
}

export interface International {
  mapcode: string;
}

export interface Local {
  mapcode: string;
  territory?: string;
}
