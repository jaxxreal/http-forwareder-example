import { IDashboardServices, TrackingEvent } from './IDashboardServices';
import axios, { AxiosInstance } from 'axios';
import { IMapcodeService } from './MapcodeService';
import { capitalize } from '../utils';
import * as AxiosLogger from 'axios-logger';

export class SkyAnalyticsService implements IDashboardServices {
  URL = 'https://sweeps.proxy.beeceptor.com/skyanalytics/get';

  client: AxiosInstance;

  constructor(private mapcodeService: IMapcodeService) {
    this.client = axios.create({
      baseURL: this.URL,
    });
    this.client.interceptors.response.use(AxiosLogger.responseLogger);
    this.client.interceptors.request.use(AxiosLogger.requestLogger);
  }

  async transformData(payload: TrackingEvent) {
    const { international } = await this.mapcodeService.convertLocationToMapcode(payload['lat-lon']);

    return Object.keys(payload).reduce((res, key) => {
      if (key === 't') {
        return { ...res, t: payload[key] };
      }

      if (key === 'lat-lon') {
        res[capitalize(key)] = international.mapcode;
      } else {
        res[capitalize(key)] = payload[key];
      }

      return res;
    }, {});
  }

  async send(payload: TrackingEvent) {
    return this.client.request({
      method: 'POST',
      data: await this.transformData(payload),
    });
  }
}
