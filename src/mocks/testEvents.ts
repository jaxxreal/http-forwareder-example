import { TrackingEvent } from '../services/IDashboardServices';

export const testEvent1: TrackingEvent = {
  t: 'lift-off',
  engines: 4,
  fuel: 78,
  successful: true,
  temperature: {
    engine: 80,
    cabin: 31,
  },
  timestamp: 1595244264059,
  'lat-lon': [-16.270183, 168.110748],
};

export const testEvent2: TrackingEvent = {
  t: 'landing',
  engines: 1,
  fuel: 26,
  successful: true,
  temperature: {
    engine: 80,
    cabin: 31,
  },
  timestamp: 1595524813145,
  'lat-lon': [51.769455, 182.81861],
};
