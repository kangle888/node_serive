import app from './app/index.js';
import { SERVER_PORT } from './config/index.js';
import './utils/handle-error.js';

app.listen(SERVER_PORT, () => {
  console.log(`server is running at http://localhost:${SERVER_PORT}`);
});
