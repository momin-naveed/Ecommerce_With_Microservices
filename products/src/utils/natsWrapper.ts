import nats, { Stan } from 'node-nats-streaming';
import { log } from './logger';
class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot connect nats server before initilizing it');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise((reject, resolve) => {
      this._client!.on('connect', () => {
        log.info('Product server is connect to nats server');
        resolve();
      });
      this._client?.on('error', (err) => {
        reject(err);
      });
    });
  }
}

const natsWrapper = new NatsWrapper();

export default natsWrapper;
