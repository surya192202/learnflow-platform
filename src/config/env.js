const dotenv = require('dotenv');
dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'surya',
    database: process.env.DB_NAME || 'learnflow',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_for_development',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_for_development',
    accessExpiresIn: '15m',
    refreshExpiresIn: '30d',
  },
};

module.exports = env;
