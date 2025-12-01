const dotenvFlow = require('dotenv-flow');

dotenvFlow.config();

const common = {
  client: 'mysql2',
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  pool: {
    min: 0,
    max: Number(process.env.DB_POOL_MAX) || 5
  }
};

const connection = () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'health_manager'
});

module.exports = {
  development: {
    ...common,
    connection: connection()
  },
  test: {
    ...common,
    connection: {
      ...connection(),
      database: process.env.DB_NAME || 'health_manager_test'
    }
  },
  production: {
    ...common,
    connection: connection()
  }
};


