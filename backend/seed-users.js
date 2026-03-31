import pkg from 'pg'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import path from 'path'

const { Client } = pkg
const __filename = fileURLToPath(import.meta.url)
const baseDir = path.dirname(__filename)

async function seedUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Asongtia123$',
    database: 'lms_db',
  })

  try {
    await client.connect()
    console.log('Connected to database...')

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123', 10)
    const userPassword = await bcrypt.hash('User123', 10)

    // Clear existing users
    await client.query('DELETE FROM users')
    console.log('Cleared existing users')

    // Insert new users with hashed passwords
    const users = [
      { name: 'Admin User', email: 'admin@lms.com', password: adminPassword, role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: userPassword, role: 'user' },
      { name: 'Jane Smith', email: 'jane@example.com', password: userPassword, role: 'user' },
      { name: 'Bob Johnson', email: 'bob@example.com', password: userPassword, role: 'user' },
    ]

    for (const user of users) {
      await client.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [user.name, user.email, user.password, user.role]
      )
      console.log(`✓ Created user: ${user.email}`)
    }

    console.log('\n✅ Users seeded successfully!\n')
    console.log('Test Credentials:')
    console.log('Admin:')
    console.log('  Email: admin@lms.com')
    console.log('  Password: Admin123')
    console.log('\nUser:')
    console.log('  Email: john@example.com')
    console.log('  Password: User123')

    await client.end()
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

seedUsers()
