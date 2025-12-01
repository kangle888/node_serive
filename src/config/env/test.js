export default {
  app: {
    port: Number(process.env.SERVER_PORT) || 4000
  },
  db: {
    database: process.env.DB_NAME || 'health_manager_test'
  },
  log: {
    level: process.env.LOG_LEVEL || 'warn'
  }
};


