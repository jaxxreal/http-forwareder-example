import axios, { AxiosInstance } from 'axios';

import { MonitorService } from './MonitorService';
import { testEvent1, testEvent2 } from '../mocks/testEvents';

let monitorService: MonitorService;
let axiosInstanceMock: AxiosInstance;
const testEvent1Transformed = { ...testEvent1 };
delete testEvent1Transformed.timestamp;

const testEvent2Transformed = { ...testEvent2 };
delete testEvent2Transformed.timestamp;

beforeEach(() => {
  axiosInstanceMock = {
    put: jest.fn().mockResolvedValue('OK'),
  } as any;
  (axios as any).create = jest.fn(() => axiosInstanceMock);
  monitorService = new MonitorService();
});

describe('MonitorService', () => {
  test('should exist', () => {
    expect(monitorService).toBeTruthy();
  });

  test.each([
    ['event1', testEvent1, testEvent1Transformed],
    ['event2', testEvent2, testEvent2Transformed],
  ])('should send tracking event "%s" properly', async (eventName, input, result) => {
    expect(await monitorService.send(input)).toBe('OK');

    expect((axios as any).create).toBeCalledWith({
      baseURL: monitorService.URL,
    });

    const timestamp = (input.timestamp / 1000).toFixed(0);

    expect(axiosInstanceMock.put).toBeCalledWith(timestamp, result);
  });
});
