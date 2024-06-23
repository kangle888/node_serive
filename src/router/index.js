import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const registerRouter = async (app) => {
  const files = fs.readdirSync(__dirname);
  for (const file of files) {
    if (!file.endsWith('.router.js')) continue;
    const filePath = path.join(__dirname, file);
    // Windows 路径转换为 file URL
    const fileURL = `file://${filePath.replace(/\\/g, '/')}`;

    console.log(fileURL, '----111-------');

    const routerModule = await import(fileURL);
    if (routerModule.default) {
      const router = routerModule.default;
      app.use(router.routes());
      app.use(router.allowedMethods());
    }
  }
};
