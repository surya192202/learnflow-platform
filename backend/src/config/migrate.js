/**
 * migrate.js - Apply schema.sql to Aiven MySQL
 * Run with: node backend/src/config/migrate.js
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
  console.log('🚀 Connecting to Aiven MySQL...');
  console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`   DB:   ${process.env.DB_NAME}`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    });

    console.log('✅ Connected! Applying schema...\n');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const rawSql = fs.readFileSync(schemaPath, 'utf8');

    // Remove all single-line comments, then split by semicolons
    const cleanedSql = rawSql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10); // skip empty/whitespace chunks

    let created = 0;
    for (const stmt of statements) {
      try {
        await connection.query(stmt);
        const match = stmt.match(/CREATE TABLE IF NOT EXISTS `?(\w+)`?/i);
        if (match) {
          console.log(`  ✔ Table '${match[1]}' created/verified`);
          created++;
        }
      } catch (err) {
        console.error(`  ✖ Failed: ${stmt.substring(0, 80).replace(/\n/g, ' ')}...`);
        console.error(`    Error: ${err.message}`);
        // Don't exit — try remaining statements
      }
    }

    // Verify all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📋 Tables now in Aiven database (${tables.length}):`);
    tables.forEach(row => console.log('  -', Object.values(row)[0]));

    if (tables.length === 0) {
      console.error('\n⚠️  No tables found — check for errors above.');
    } else {
      console.log('\n🎉 Migration complete! Aiven MySQL is ready.');
    }
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
      console.error('   → Check DB_HOST and DB_PORT in .env');
    } else if (err.message.includes('Access denied')) {
      console.error('   → Check DB_USER and DB_PASSWORD in .env');
    } else if (err.message.includes('SSL')) {
      console.error('   → SSL error. Check rejectUnauthorized setting.');
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();
