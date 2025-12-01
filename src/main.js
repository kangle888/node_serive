import app from './app/index.js';
import { appConfig } from './config/index.js';
import './utils/handle-error.js';

app.listen(appConfig.port, () => {
  console.log(`server is running at http://localhost:${appConfig.port}`);
});
