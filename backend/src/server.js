const app = require('./app');
const env = require('./config/env');
const pool = require('./config/db');

async function startServer() {
  try {
    // Check DB connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully.');
    connection.release();

    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

startServer();
