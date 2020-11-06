import axios, { AxiosInstance } from 'axios';

import { testEvent1, testEvent2 } from '../mocks/testEvents';
import { SkyAnalyticsService } from './SkyAnalyticsService';
import { IMapcodeService } from './MapcodeService';

let skyAnalyticsService: SkyAnalyticsService;
let mapcodeService: IMapcodeService;
let axiosInstanceMock: AxiosInstance;

const testEvent1Transformed = {
  t: 'lift-off',
  Engines: 4,
  Fuel: 78,
  Successful: true,
  Temperature: {
    engine: 80,
    cabin: 31,
  },
  Timestamp: 1595244264059,
  'Lat-lon': 'CYZ7V.DYDG',
};

const testEvent2Transformed = {
  t: 'landing',
  Engines: 1,
  Fuel: 26,
  Successful: true,
  Temperature: {
    engine: 80,
    cabin: 31,
  },
  Timestamp: 1595524813145,
  'Lat-lon': 'V07HV.VS2D',
};

beforeEach(() => {
  axiosInstanceMock = {
    request: jest.fn().mockResolvedValue('OK'),
  } as any;
  (axios as any).create = jest.fn(() => axiosInstanceMock);
  mapcodeService = {
    convertLocationToMapcode: jest.fn((input) => {
      switch (input.join(',')) {
        case '-16.270183,168.110748':
          return { international: { mapcode: 'CYZ7V.DYDG' } };
        case '51.769455,182.81861':
          return { international: { mapcode: 'V07HV.VS2D' } };
      }
    }),
  } as any;

  skyAnalyticsService = new SkyAnalyticsService(mapcodeService);
});

describe('SkyAnalyticsService', () => {
  test('should exist', () => {
    expect(skyAnalyticsService).toBeTruthy();
  });

  test.each([
    ['event1', testEvent1, testEvent1Transformed],
    ['event2', testEvent2, testEvent2Transformed],
  ])('should send tracking event "%s" properly', async (eventName, input, result) => {
    expect(await skyAnalyticsService.send(input)).toBe('OK');

    expect((axios as any).create).toBeCalledWith({
      baseURL: skyAnalyticsService.URL,
    });

    expect(axiosInstanceMock.request).toBeCalledWith({
      method: 'POST',
      data: result,
    });
  });
});
