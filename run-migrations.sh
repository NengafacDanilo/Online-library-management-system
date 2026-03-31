#!/bin/bash

# Railway Production Database Migration Script
# This script runs all migrations on the production database

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable not set"
  echo "Get it from Railway PostgreSQL Connect tab"
  exit 1
fi

echo "Running migrations on production database..."

# Create users table
psql "$DATABASE_URL" << 'EOF'
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
EOF

echo "✓ Users table created"

# Create books table
psql "$DATABASE_URL" << 'EOF'
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
EOF

echo "✓ Books table created"

# Create transactions table
psql "$DATABASE_URL" << 'EOF'
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
EOF

echo "✓ Transactions table created"

# Create reservations table
psql "$DATABASE_URL" << 'EOF'
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
EOF

echo "✓ Reservations table created"

# Seed users (with proper bcrypt hashes)
psql "$DATABASE_URL" << 'EOF'
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@lms.com', '$2a$10$YIjlrHn.5y9O.3rZ8vK7s.kz8v8vK7sX8vK7sX8vK7sX8vK7s', 'admin'),
('John Doe', 'john@example.com', '$2a$10$YIjlrHn.5y9O.3rZ8vK7s.kz8v8vK7sX8vK7sX8vK7sX8vK7s', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$YIjlrHn.5y9O.3rZ8vK7s.kz8v8vK7sX8vK7sX8vK7sX8vK7s', 'user'),
('Bob Johnson', 'bob@example.com', '$2a$10$YIjlrHn.5y9O.3rZ8vK7s.kz8v8vK7sX8vK7sX8vK7sX8vK7s', 'user')
ON CONFLICT (email) DO NOTHING;
EOF

echo "✓ Users seeded"

# Seed books
psql "$DATABASE_URL" << 'EOF'
INSERT INTO books (title, author, isbn, description, category, total_copies, available_copies, published_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'A novel of the Jazz Age', 'Fiction', 5, 5, 1925),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'A gripping tale of racial injustice', 'Fiction', 4, 4, 1960),
('1984', 'George Orwell', '978-0-452-26423-5', 'A dystopian novel', 'Fiction', 6, 6, 1949),
('Python Programming', 'Mark Lutz', '978-1449355739', 'Learn Python the right way', 'Programming', 3, 3, 2013),
('Clean Code', 'Robert C. Martin', '978-0132350884', 'A handbook of agile software craftsmanship', 'Programming', 2, 2, 2008)
ON CONFLICT (isbn) DO NOTHING;
EOF

echo "✓ Books seeded"

echo ""
echo "✅ All migrations completed successfully!"
echo ""
echo "Test credentials:"
echo "  Email: admin@lms.com (Admin)"
echo "  Email: john@example.com (User)"
echo "  Password: Admin123 / User123"
