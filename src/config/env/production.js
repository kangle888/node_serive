export default {
  app: {
    port: Number(process.env.SERVER_PORT) || 10000
  },
  log: {
    level: process.env.LOG_LEVEL || 'info'
  }
};


