import * as http from 'http';
import { RootController } from './controllers/RootController';
import { MonitorService } from './services/MonitorService';
import { SkyAnalyticsService } from './services/SkyAnalyticsService';
import { MapcodeService } from './services/MapcodeService';
import { SpaceshipService } from './services/SpaceshipService';

http
  .createServer((request, response) => {
    let chunks = '';
    request.on('data', (chunk) => {
      chunks += chunk;
      if (chunks.length > 1e6) {
        // kill the request if a payload too big
        request.connection.destroy();
      }
    });
    request.on('end', () => {
      const data = JSON.parse(chunks);

      new RootController(request, response, [
        new MonitorService(),
        new SkyAnalyticsService(new MapcodeService()),
        new SpaceshipService(),
      ]).handleRequest(data);
    });
  })
  .listen(1337);

console.log('🚀 Server listens on http://localhost:1337');
