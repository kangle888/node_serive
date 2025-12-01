import dotenvFlow from 'dotenv-flow';
import defaultConfig from './env/default.js';
import developmentConfig from './env/development.js';
import testConfig from './env/test.js';
import productionConfig from './env/production.js';

dotenvFlow.config();

const ENV = process.env.NODE_ENV || 'development';

const envMap = {
  development: developmentConfig,
  test: testConfig,
  production: productionConfig
};

const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

const mergeDeep = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
};

const config = mergeDeep(defaultConfig, envMap[ENV] || {});

export const appConfig = config.app;
export const dbConfig = config.db;
export const jwtConfig = config.jwt;
export const uploadConfig = config.upload;
export const logConfig = config.log;

export default config;
