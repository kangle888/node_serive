import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// 获取当前模块文件的路径
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块文件所在目录的路径
const __dirname = path.dirname(__filename);

const privateKeyPath = path.join(__dirname, 'keys/private.key');
export const PRIVATE_KEY = fs.readFileSync(privateKeyPath);

const publicKeyPath = path.join(__dirname, 'keys/public.key');
export const PUBLIC_KEY = fs.readFileSync(publicKeyPath);
