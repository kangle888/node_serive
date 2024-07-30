import app from './app/index.js';
import { SERVER_PORT } from './config/index.js';
import './utils/handle-error.js';
// import { registerRouter } from './router/index.js';

app.listen(SERVER_PORT, () => {
  // registerRouter();
  console.log(`server is running at http://localhost:${SERVER_PORT}`);
});
