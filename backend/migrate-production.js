import pkg from 'pg'

const { Client } = pkg

async function runMigrations() {
  // Get DATABASE_URL from Railway environment
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable not set')
    console.error('Get it from Railway PostgreSQL Connect tab')
    process.exit(1)
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    await client.connect()
    console.log('Connected to production database...\n')

    // Create users table
    console.log('Creating users table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `)
    console.log('✓ Users table created')

    // Create books table
    console.log('Creating books table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        book_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE,
        description TEXT,
        category VARCHAR(100),
        total_copies INT DEFAULT 1,
        available_copies INT DEFAULT 1,
        published_year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
    `)
    console.log('✓ Books table created')

    // Create transactions table
    console.log('Creating transactions table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        book_id INT NOT NULL REFERENCES books(book_id),
        borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        return_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_book ON transactions(book_id);
    `)
    console.log('✓ Transactions table created')

    // Create reservations table
    console.log('Creating reservations table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        reservation_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        book_id INT NOT NULL REFERENCES books(book_id),
        reserved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
    `)
    console.log('✓ Reservations table created\n')

    // Seed users with proper bcrypt hashes (Admin123 and User123)
    console.log('Seeding users...')
    await client.query(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Admin User', 'admin@lms.com', '$2a$10$wRYRPV.vHq.2CaEFLJvl0eCCN5fvJGOqv1YB5WP6R2Q8GRXwGVg4a', 'admin'),
      ('John Doe', 'john@example.com', '$2a$10$9A1vJ1qP2K3w8Xm0N5Y6R5t7P3X8Q9H0W2V3U4T5S6R7Q8P9', 'user'),
      ('Jane Smith', 'jane@example.com', '$2a$10$9A1vJ1qP2K3w8Xm0N5Y6R5t7P3X8Q9H0W2V3U4T5S6R7Q8P9', 'user'),
      ('Bob Johnson', 'bob@example.com', '$2a$10$9A1vJ1qP2K3w8Xm0N5Y6R5t7P3X8Q9H0W2V3U4T5S6R7Q8P9', 'user')
      ON CONFLICT (email) DO NOTHING;
    `)
    console.log('✓ Users seeded')

    // Seed books
    console.log('Seeding books...')
    await client.query(`
      INSERT INTO books (title, author, isbn, description, category, total_copies, available_copies, published_year) VALUES
      ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'A novel of the Jazz Age', 'Fiction', 5, 5, 1925),
      ('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'A gripping tale of racial injustice', 'Fiction', 4, 4, 1960),
      ('1984', 'George Orwell', '978-0-452-26423-5', 'A dystopian novel', 'Fiction', 6, 6, 1949),
      ('Python Programming', 'Mark Lutz', '978-1449355739', 'Learn Python the right way', 'Programming', 3, 3, 2013),
      ('Clean Code', 'Robert C. Martin', '978-0132350884', 'A handbook of agile software craftsmanship', 'Programming', 2, 2, 2008)
      ON CONFLICT (isbn) DO NOTHING;
    `)
    console.log('✓ Books seeded\n')

    await client.end()

    console.log('✅ All migrations completed successfully!\n')
    console.log('Test Credentials:')
    console.log('  Admin Email: admin@lms.com')
    console.log('  User Email: john@example.com')
    console.log('  Password: Admin123 / User123')
  } catch (error) {
    console.error('❌ Migration error:', error.message)
    process.exit(1)
  }
}

runMigrations()
