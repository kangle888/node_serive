import knex from 'knex';
import { dbConfig } from '../config/index.js';

const knexClient = knex({
  client: dbConfig.client,
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  },
  pool: {
    min: 0,
    max: dbConfig.connectionLimit || 5
  }
});

export default knexClient;


