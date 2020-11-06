import axios, { AxiosInstance } from 'axios';

import { IDashboardServices, TrackingEvent } from './IDashboardServices';
import { isPlainObject } from '../utils';
import * as AxiosLogger from 'axios-logger';

export class SpaceshipService implements IDashboardServices {
  URL = 'https://sweeps.proxy.beeceptor.com/spaceship/r';

  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.URL,
    });
    this.client.interceptors.response.use(AxiosLogger.responseLogger);
    this.client.interceptors.request.use(AxiosLogger.requestLogger);
  }

  transformData(payload: TrackingEvent) {
    return Object.keys(payload).reduce((result, key) => {
      const value = payload[key];
      if (Array.isArray(value)) {
        result[key] = value.join();
      } else if (isPlainObject(value)) {
        Object.keys(value).forEach((nestedKey) => {
          result[`${key}.${nestedKey}`] = value[nestedKey];
        });
      } else {
        result[key] = value;
      }
      return result;
    }, {});
  }

  async send(payload: TrackingEvent) {
    return this.client.request({
      method: 'POST',
      data: this.transformData(payload),
    });
  }
}
