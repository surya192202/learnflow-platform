const dotenv = require('dotenv');
dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'mysql-c31fec6-surya192202-7118.k.aivencloud.com',
    port: parseInt(process.env.DB_PORT || '15057', 10),
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS_vTqkgzTzmN5a_TQ5Ghz',
    database: process.env.DB_NAME || 'defaultdb',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_for_development',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_for_development',
    accessExpiresIn: '15m',
    refreshExpiresIn: '30d',
  },
  hf: {
    token: process.env.HF_TOKEN || '',
    model: 'meta-llama/Llama-3.1-8B-Instruct',
  },
};

module.exports = env;
