const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('./src/config/env');

async function seedDatabase() {
  console.log('Starting exact DB initialization...');

  let connection;
  try {
    // 1. Connect without database selected to create it first
    connection = await mysql.createConnection({
      host: env.db.host,
      user: env.db.user,
      password: env.db.password,
    });

    console.log(`Connected to MySQL as ${env.db.user}. Creating database "${env.db.database}" if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\`;`);
    await connection.query(`USE \`${env.db.database}\`;`);

    // 2. Read the SQL schema file
    const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
    const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

    // 3. Split by semicolon to run statements sequentially
    const statements = sqlSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`Found ${statements.length} SQL statements. Executing...`);

    for (let statement of statements) {
      await connection.query(statement);
    }

    console.log('\n✅ Database schema successfully initialized over MySQL!');

  } catch (error) {
    console.error('\n❌ Error during database initialization:\n', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nTIP: It looks like your MySQL password is wrong or the server is rejecting the connection.');
      console.log('Please check the DB_PASSWORD in your .env file.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

seedDatabase();
