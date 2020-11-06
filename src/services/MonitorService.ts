import { IDashboardServices, TrackingEvent } from './IDashboardServices';
import axios, { AxiosInstance } from 'axios';
import * as AxiosLogger from 'axios-logger';

export class MonitorService implements IDashboardServices {
  URL = 'https://sweeps.proxy.beeceptor.com/m0nit0r.com/track_ship/';

  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.URL,
    });
    this.client.interceptors.response.use(AxiosLogger.responseLogger);
    this.client.interceptors.request.use(AxiosLogger.requestLogger);
  }

  transformData(payload: TrackingEvent) {
    const { timestamp, ..._payload } = payload;
    return { timestamp: (timestamp / 1000).toFixed(0), payload: _payload };
  }

  async send(payload: TrackingEvent) {
    const { timestamp, payload: event } = this.transformData(payload);
    return this.client.put(timestamp, event);
  }
}
