import { app } from './utils/app';
import config from 'config';
import { log } from './utils/logger';
import swaggerDocs from './utils/swagger';
import connectDB from './utils/connectDB';
import { natsConnect } from './utils/natsConnect.nats';

const PORT = config.get<number>('port');
const HOST = config.get<string>('host');

const server = app.listen(PORT, async () => {
  await connectDB();
  await natsConnect();
  log.info(
    `Authentication server is listening on port " http://${HOST}/api/v1/users "`
  );
  swaggerDocs(app);
});

process.on('unhandledRejection', (err: any) => {
  server.close(process.exit(1));
});
