import winston from 'winston';
import { logConfig } from '../config/index.js';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: logConfig.level,
  format: combine(timestamp(), logFormat),
  transports: [new winston.transports.Console({ format: combine(colorize(), timestamp(), logFormat) })]
});


