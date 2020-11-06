import { AxiosInstance } from 'axios';

export interface TrackingEvent {
  t: string;
  engines: number;
  fuel: number;
  successful: boolean;
  temperature: Temperature;
  timestamp: number;
  'lat-lon': [number, number];
}

export interface Temperature {
  engine: number;
  cabin: number;
}

export interface IDashboardServices {
  URL: string;
  client: AxiosInstance;
  send(payload: TrackingEvent): Promise<any>;
}
