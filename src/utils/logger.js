import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { logConfig } from '../config/index.js';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// 确保日志目录存在
if (logConfig.dir && !fs.existsSync(logConfig.dir)) {
  fs.mkdirSync(logConfig.dir, { recursive: true });
}

const transports = [
  new winston.transports.Console({ format: combine(colorize(), timestamp(), logFormat) })
];

if (logConfig.dir) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logConfig.dir, 'app.log'),
      level: logConfig.level,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logConfig.dir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  );
}

export const logger = winston.createLogger({
  level: logConfig.level,
  format: combine(timestamp(), logFormat),
  transports
});


