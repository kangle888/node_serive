import http from 'http';
import app from './app/index.js';
import { appConfig } from './config/index.js';
import './utils/handle-error.js';
import { initRealtime } from './realtime/socket.js';

const server = http.createServer(app.callback());
initRealtime(server);

server.listen(appConfig.port, () => {
  console.log(`server is running at http://localhost:${appConfig.port}`);
});
