import { IDashboardServices, TrackingEvent } from '../services/IDashboardServices';
import { IncomingMessage, ServerResponse } from 'http';

type EventsPayload = { events: TrackingEvent[] };

export class RootController {
  constructor(private request: IncomingMessage, private response: ServerResponse, private dashboardServices: IDashboardServices[]) {}

  handleRequest(data: unknown) {
    if (this.request.url === '/' && this.request.method === 'POST') {
      this.processEvents(data as EventsPayload);
    } else {
      this.response.writeHead(404);
      this.response.end('Not found');
    }
  }

  private async processEvents({ events }: EventsPayload) {
    const promises = [];

    events.forEach(event => {
      promises.push(...this.dashboardServices.map(service => service.send(event)));
    });

    await Promise.all(promises);
    this.response.writeHead(200);
    this.response.end('OK');
  }
}
