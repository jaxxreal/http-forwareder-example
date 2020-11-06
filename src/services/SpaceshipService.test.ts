import axios from 'axios';
import { SpaceshipService } from './SpaceshipService';
import { testEvent1, testEvent2 } from '../mocks/testEvents';

let spaceshipService: SpaceshipService;
let axiosInstanceMock: Record<string, jest.Mock>;

const testEvent1Transformed = {
  t: 'lift-off',
  engines: 4,
  fuel: 78,
  successful: true,
  'temperature.engine': 80,
  'temperature.cabin': 31,
  timestamp: 1595244264059,
  'lat-lon': '-16.270183,168.110748',
};
const testEvent2Transformed = {
  t: 'landing',
  engines: 1,
  fuel: 26,
  successful: true,
  'temperature.engine': 80,
  'temperature.cabin': 31,
  timestamp: 1595524813145,
  'lat-lon': '51.769455,182.81861',
};

beforeEach(() => {
  axiosInstanceMock = {
    request: jest.fn().mockResolvedValue('OK'),
  };
  (axios as any).create = jest.fn(() => axiosInstanceMock);
  spaceshipService = new SpaceshipService();
});

describe('SpaceshipService', () => {
  test('should exist', () => {
    expect(spaceshipService).toBeTruthy();
  });

  test.each([
    ['event1', testEvent1, testEvent1Transformed],
    ['event2', testEvent2, testEvent2Transformed],
  ])('should send tracking event "%s" properly', async (eventName, input, result) => {
    expect(await spaceshipService.send(input)).toBe('OK');

    expect((axios as any).create).toBeCalledWith({
      baseURL: spaceshipService.URL,
    });

    expect(axiosInstanceMock.request).toBeCalledWith({
      method: 'POST',
      data: result,
    });
  });
});
