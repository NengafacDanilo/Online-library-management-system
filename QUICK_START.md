# ⚡ Quick Start Commands

## One-Time Setup

### 1. Create PostgreSQL Database
```bash
psql -U postgres

CREATE DATABASE lms_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE lms_db TO postgres;
\c lms_db
GRANT ALL ON SCHEMA public TO postgres;
\q
```

### 2. Run Migrations
```bash
cd database/migrations
psql -U postgres -d lms_db -f 001_create_users_table.sql
psql -U postgres -d lms_db -f 002_create_books_table.sql
psql -U postgres -d lms_db -f 003_create_transactions_table.sql
psql -U postgres -d lms_db -f 004_create_reservations_table.sql

cd ../seeds
psql -U postgres -d lms_db -f 001_seed_users.sql
psql -U postgres -d lms_db -f 002_seed_books.sql
```

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Development (Every Time You Work)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Terminal 3 - Database (optional, for SQL queries)
```bash
psql -U postgres -d lms_db
SELECT * FROM books;
\q
```

---

## Test Credentials

**Admin:**
- Email: `admin@library.com`
- Password: `Admin123`

**User 1:**
- Email: `user1@library.com`
- Password: `User123`

**User 2:**
- Email: `user2@library.com`
- Password: `User123`

---

## Environment Variables

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_super_secret_jwt_key_change_in_production_environment_12345
JWT_EXPIRE=7d
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Library Management System
```

---

## Useful Commands

### Backend
```bash
npm run dev          # Start dev server with hot reload
npm start            # Start production server
npm install <pkg>    # Install a new package
npm list             # View installed packages
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm install <pkg>    # Install a new package
```

### Database
```bash
psql -U postgres -d lms_db              # Connect to database
\dt                                     # List all tables
\d users                                # Describe users table
SELECT * FROM users;                    # View all users
SELECT COUNT(*) FROM books;             # Count books
\q                                      # Disconnect
```

---

## API Endpoints

### Authentication
```
POST   /api/users/register    - Register new user
POST   /api/users/login       - Login user
GET    /api/users/profile     - Get user profile
PUT    /api/users/profile     - Update user profile
```

### Books
```
GET    /api/books             - Get all books (paginated)
GET    /api/books/:id         - Get book details
GET    /api/books/search      - Search books
GET    /api/books/category/:cat - Books by category
POST   /api/books             - Create book (admin only)
PUT    /api/books/:id         - Update book (admin only)
DELETE /api/books/:id         - Delete book (admin only)
```

### Transactions
```
POST   /api/transactions/borrow           - Borrow a book
POST   /api/transactions/return           - Return a book
GET    /api/transactions/history/:userId  - User's history
GET    /api/transactions/active/:userId   - Active borrows
GET    /api/transactions/overdue/list     - Overdue books
GET    /api/transactions                  - All transactions (admin)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | `netstat -ano \| findstr :5000` then `taskkill /PID <id> /F` |
| DB connection failed | Check .env, ensure PostgreSQL is running |
| npm module not found | `rm -rf node_modules package-lock.json && npm install` |
| Frontend not loading | Check VITE_API_BASE_URL in .env |
| CORS error | Verify backend CORS config in server.js |

---

## Project Structure

```
Online Library Management System/
├── backend/                    (Node.js/Express API)
│   ├── src/
│   │   ├── models/            (Database models)
│   │   ├── controllers/       (Business logic)
│   │   ├── routes/            (API endpoints)
│   │   ├── middleware/        (Auth, validation)
│   │   ├── server.js          (Entry point)
│   │   └── database.js        (DB connection)
│   ├── .env                   (Environment vars)
│   └── package.json
│
├── frontend/                   (React/Vite app)
│   ├── src/
│   │   ├── pages/             (Page components)
│   │   ├── components/        (Reusable components)
│   │   ├── context/           (Zustand stores)
│   │   ├── services/          (API calls)
│   │   ├── App.jsx            (Router setup)
│   │   └── index.css          (Tailwind styles)
│   ├── .env                   (Environment vars)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── database/                   (PostgreSQL)
│   ├── migrations/            (Schema files)
│   └── seeds/                 (Sample data)
│
└── Documentation/
    ├── SETUP_GUIDE.md         (This file - detailed setup)
    ├── PROJECT_STRUCTURE.md   (Project overview)
    ├── MODULES_DOCUMENTATION.md (API docs)
    └── UI_COMPONENTS_GUIDE.md (Frontend docs)
```

---

## ✅ Verification Checklist

Run these after setup to verify everything works:

```bash
# 1. Check database
psql -U postgres -d lms_db -c "\dt"
# Should show: users, books, transactions, reservations

# 2. Check backend starts
cd backend
npm run dev
# Should show: "Server running on http://localhost:5000"

# 3. Check frontend builds
cd ../frontend
npm run dev
# Should show: "Local: http://localhost:5173"

# 4. Test API
curl http://localhost:5000/api/books
# Should return JSON array of books

# 5. Test login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"Admin123"}'
# Should return token and user object
```

---

## 🎯 Next Steps

1. ✅ Follow the setup steps above
2. ✅ Start both servers
3. ✅ Open http://localhost:5173 in browser
4. ✅ Login with test credentials
5. ✅ Browse books, test borrow/return
6. ✅ Check dashboard and profile pages

---

## 📚 Documentation

- **Setup Guide** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Project Structure** → [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **API Endpoints** → [MODULES_DOCUMENTATION.md](MODULES_DOCUMENTATION.md)
- **UI Components** → [UI_COMPONENTS_GUIDE.md](UI_COMPONENTS_GUIDE.md)

---

**Last Updated:** March 30, 2026
**Status:** ✅ Production Ready
