import pkg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pkg
const __filename = fileURLToPath(import.meta.url)
const baseDir = path.dirname(__filename)

async function setupDatabase() {
  // First, create the database as the default postgres user
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Asongtia123$',
    database: 'postgres',
  })

  try {
    console.log('Connecting to PostgreSQL...')
    await adminClient.connect()
    console.log('✓ Connected to PostgreSQL')

    // Check if database exists
    const dbCheckResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = 'lms_db'`
    )

    if (dbCheckResult.rows.length === 0) {
      console.log('Creating database lms_db...')
      await adminClient.query('CREATE DATABASE lms_db')
      console.log('✓ Database lms_db created')
    } else {
      console.log('✓ Database lms_db already exists')
    }

    await adminClient.end()

    // Connect to the new database and run migrations
    const dbClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'Asongtia123$',
      database: 'lms_db',
    })

    console.log('Connecting to lms_db...')
    await dbClient.connect()
    console.log('✓ Connected to lms_db')

    // Run migrations
    const migrationsDir = path.join(baseDir, '..', 'database', 'migrations')
    const migrationFiles = [
      '001_create_users_table.sql',
      '002_create_books_table.sql',
      '003_create_transactions_table.sql',
      '004_create_reservations_table.sql',
    ]

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Running migration: ${file}...`)
      await dbClient.query(sql)
      console.log(`✓ ${file} completed`)
    }

    // Run seeds
    const seedsDir = path.join(baseDir, '..', 'database', 'seeds')
    const seedFiles = ['001_seed_users.sql', '002_seed_books.sql']

    for (const file of seedFiles) {
      const filePath = path.join(seedsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Seeding: ${file}...`)
      await dbClient.query(sql)
      console.log(`✓ ${file} completed`)
    }

    await dbClient.end()
    console.log('\n✅ Database setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up database:', error.message)
    process.exit(1)
  }
}

setupDatabase().catch(err => {
  console.error('Setup failed:', err)
  process.exit(1)
})
