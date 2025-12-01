import fs from 'fs';
import { jwtConfig } from './index.js';

export const PRIVATE_KEY = fs.readFileSync(jwtConfig.privateKeyPath);
export const PUBLIC_KEY = fs.readFileSync(jwtConfig.publicKeyPath);
