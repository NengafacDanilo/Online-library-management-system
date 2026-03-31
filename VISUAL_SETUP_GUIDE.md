# 🎯 Step-by-Step Setup Visual Guide

## Overview: 4 Main Steps

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: PostgreSQL Database Setup (5 min)                 │
│  ✅ Create database                                         │
│  ✅ Run migrations                                          │
│  ✅ Load sample data                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Install Dependencies (3 min)                      │
│  ✅ Backend: npm install                                    │
│  ✅ Frontend: npm install                                   │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Start Servers (2 terminals)                       │
│  ✅ Backend: npm run dev (port 5000)                        │
│  ✅ Frontend: npm run dev (port 5173)                       │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Test Application                                  │
│  ✅ Open http://localhost:5173                             │
│  ✅ Login & test features                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## STEP 1: PostgreSQL Database Setup

### 1.1 Create Database
```
PostgreSQL Command Line:
┌─────────────────────────────────────────┐
│ $ psql -U postgres                      │
│ postgres=# CREATE DATABASE lms_db;      │
│ postgres=# \q                           │
└─────────────────────────────────────────┘

Expected: "CREATE DATABASE" (no error)
```

### 1.2 Run Migrations

```
From project root directory:

Migration 1 (Users):
$ cd database/migrations
$ psql -U postgres -d lms_db -f 001_create_users_table.sql

Migration 2 (Books):
$ psql -U postgres -d lms_db -f 002_create_books_table.sql

Migration 3 (Transactions):
$ psql -U postgres -d lms_db -f 003_create_transactions_table.sql

Migration 4 (Reservations):
$ psql -U postgres -d lms_db -f 004_create_reservations_table.sql

Expected: CREATE TABLE (no error)
```

### 1.3 Load Sample Data

```
$ cd ../seeds
$ psql -U postgres -d lms_db -f 001_seed_users.sql
$ psql -U postgres -d lms_db -f 002_seed_books.sql

Expected: INSERT statements execute (no error)
```

### 1.4 Verify Database

```
$ psql -U postgres -d lms_db
lms_db=# \dt

Expected output:
 Schema |     Name      | Type  | Owner
--------+---------------+-------+----------
 public | books         | table | postgres
 public | reservations  | table | postgres
 public | transactions  | table | postgres
 public | users         | table | postgres
(4 rows)

lms_db=# SELECT COUNT(*) FROM users;
 count
-------
     4
(1 row)

lms_db=# SELECT COUNT(*) FROM books;
 count
-------
     7
(1 row)

lms_db=# \q
```

✅ **Step 1 Complete!**

---

## STEP 2: Install Dependencies

### 2.1 Backend Dependencies

```
Project Root:
$ cd backend
$ npm install

Dependencies installed:
├── express ^4.18.2
├── pg ^8.11.3
├── dotenv ^16.3.1
├── cors ^2.8.5
├── jsonwebtoken ^9.1.2
├── bcryptjs ^2.4.3
├── joi ^17.11.0
├── morgan ^1.10.0
└── [dev] nodemon ^3.0.2

Expected: up to date, audited X packages (no error)
```

### 2.2 Frontend Dependencies

```
From project root (or new terminal):
$ cd frontend
$ npm install

Dependencies installed:
├── react ^18.2.0
├── react-dom ^18.2.0
├── react-router-dom ^6.20.0
├── axios ^1.6.2
├── zustand ^4.4.1
├── tailwindcss ^3.4.1
├── vite ^5.0.8
└── [other dev dependencies...]

Expected: up to date, audited X packages (no error)
```

✅ **Step 2 Complete!**

---

## STEP 3: Start Development Servers

### 3.1 Terminal 1 - Backend Server

```
Terminal 1:
$ cd backend
$ npm run dev

Expected Output:
┌────────────────────────────────────────────┐
│ > lms-backend@1.0.0 dev                     │
│ > nodemon src/server.js                     │
│                                             │
│ [nodemon] 3.0.2                             │
│ [nodemon] to restart at any time, type `rs` │
│ [nodemon] watching path(s): src/**/*        │
│ [nodemon] watching extensions: js           │
│ [nodemon] starting `node src/server.js`     │
│                                             │
│ Server running on http://localhost:5000     │
│ Connected to database successfully          │
└────────────────────────────────────────────┘

✅ Backend Ready!
```

### 3.2 Terminal 2 - Frontend Server

```
Terminal 2:
$ cd frontend
$ npm run dev

Expected Output:
┌────────────────────────────────────────────┐
│ > lms-frontend@1.0.0 dev                    │
│ > vite                                      │
│                                             │
│ ➜  Local:   http://localhost:5173/          │
│ ➜  press h to show help                     │
│                                             │
│ VITE v5.0.8  ready in 1234 ms               │
│                                             │
│ ➜  Network:  use `--host` to expose         │
└────────────────────────────────────────────┘

✅ Frontend Ready!
```

✅ **Step 3 Complete!**

---

## STEP 4: Test Application

### 4.1 Open Browser

```
URL: http://localhost:5173

You should see:
┌──────────────────────────────────────────┐
│  LibraryHub                              │
│  Welcome to Library Management System     │
│                                          │
│  [Get Started]     [Browse]  [Admin]     │
│                                          │
│  Featured Books:                         │
│  [Book1] [Book2] [Book3]                │
│         [Book4] [Book5]                 │
│                                          │
│  Don't have account? [Register]          │
│  Already have? [Login]                   │
└──────────────────────────────────────────┘
```

### 4.2 Login

```
Click "Login" or navigate to /login

Form:
┌─────────────────────────────────────┐
│      Welcome Back!                  │
│                                     │
│  Email: [admin@library.com      ]   │
│  Password: [***********         ]   │
│                                     │
│  [  Login  ]   [Create Account]     │
└─────────────────────────────────────┘

Click Login
```

### 4.3 Dashboard

```
Expected redirect to Dashboard:

┌──────────────────────────────────────────┐
│  Welcome, Admin User! 👋                 │
│                                          │
│  📊 Statistics                           │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Borrowing│  │   Total  │  │Overdue │ │
│  │    0     │  │    0     │  │   0    │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                          │
│  Currently Borrowing                     │
│  (No books borrowed)                     │
│                                          │
│  Borrowing History                       │
│  (No history yet)                        │
└──────────────────────────────────────────┘
```

### 4.4 Browse Catalog

```
Click "Catalog" in navbar

View all 7 books:
┌──────────────────────────────────────────┐
│  📚 Book Catalog                         │
│                                          │
│  🔍 [Search books...  ]  [🔎]           │
│                                          │
│  Category:         Sort:                 │
│  □ All            ▼ Title A-Z           │
│  □ Programming                          │
│  □ Web Dev                              │
│  □ Computer Sci                         │
│                                          │
│  ┌────────────┬────────────┬────────────┐│
│  │Book1       │Book2       │Book3       ││
│  │Author 1    │Author 2    │Author 3    ││
│  │Available: 3│Available: 2│Available: 5││
│  │[Details]  │[Details]  │[Details]  ││
│  └────────────┴────────────┴────────────┘│
│  [Book4] [Book5] [Book6] [Book7]         │
└──────────────────────────────────────────┘
```

### 4.5 Borrow a Book

```
Click [Details] on a book:

┌──────────────────────────────────────────┐
│  JavaScript: The Good Parts              │
│  by Douglas Crockford                    │
│                                          │
│  ISBN: 978-0596517748                   │
│  Category: Programming                   │
│                                          │
│  [📖 Book Cover]  Availability:          │
│                   ████████░░ 80% (4/5)   │
│                                          │
│  Description:                            │
│  Excellent JavaScript reference...       │
│                                          │
│  [  Borrow Book  ]                       │
│                                          │
│  Borrowing Rules:                        │
│  • 14-day lending period                 │
│  • $1/day fine for late returns          │
│  • Can borrow max 5 books                │
│  • Reserve system available              │
└──────────────────────────────────────────┘

Click [Borrow Book]
```

### 4.6 Check Dashboard

```
Return to Dashboard - book should appear:

┌──────────────────────────────────────────┐
│  Welcome, Admin User! 👋                 │
│                                          │
│  📊 Statistics                           │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Borrowing│  │   Total  │  │Overdue │ │
│  │    1     │  │    1     │  │   0    │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                          │
│  Currently Borrowing                     │
│  ┌────────────────────────────────────┐  │
│  │ Book         | Due Date | Days Left│  │
│  │──────────────────────────────────── │  │
│  │ JavaScript   | Apr 13   |    14    │  │
│  │ [  Return  ]                       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Borrowing History                       │
│  (Empty until book is returned)          │
└──────────────────────────────────────────┘
```

### 4.7 Return Book

```
Click [Return] button

Expected:
✅ Book moves to Borrowing History
✅ Statistics update
✅ Availability increases in Catalog
```

✅ **Step 4 Complete!**

---

## Verify Everything Works

### Checklist

```
✅ Database
  [✓] PostgreSQL running
  [✓] lms_db created
  [✓] 4 tables created
  [✓] 4 users in database
  [✓] 7 books in database

✅ Backend
  [✓] npm install completed
  [✓] Server on port 5000
  [✓] No errors in console
  [✓] Can query /api/books

✅ Frontend
  [✓] npm install completed
  [✓] Server on port 5173
  [✓] Page loads in browser
  [✓] No errors in console

✅ Application
  [✓] Can login
  [✓] Can view books
  [✓] Can borrow book
  [✓] Can see in dashboard
  [✓] Can return book
  [✓] Can edit profile
  [✓] Can view history
```

---

## Terminal Reference

### All Commands at a Glance

```bash
# PostgreSQL
psql -U postgres
CREATE DATABASE lms_db;
psql -U postgres -d lms_db -f migrations/001_create_users_table.sql
psql -U postgres -d lms_db -f migrations/002_create_books_table.sql
psql -U postgres -d lms_db -f migrations/003_create_transactions_table.sql
psql -U postgres -d lms_db -f migrations/004_create_reservations_table.sql
psql -U postgres -d lms_db -f seeds/001_seed_users.sql
psql -U postgres -d lms_db -f seeds/002_seed_books.sql

# Backend
cd backend
npm install
npm run dev
# Output: Server running on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
# Output: Local: http://localhost:5173
```

---

## URL Reference

### Application URLs
```
Frontend:  http://localhost:5173
Backend:   http://localhost:5000
API:       http://localhost:5000/api

Pages:
- Home:     http://localhost:5173/
- Login:    http://localhost:5173/login
- Register: http://localhost:5173/register
- Catalog:  http://localhost:5173/books
- Details:  http://localhost:5173/books/1
- Dashboard: http://localhost:5173/dashboard
- Profile:  http://localhost:5173/profile
```

---

## Test Credentials

```
Admin Account:
  Email: admin@library.com
  Password: Admin123

User Accounts:
  Email: user1@library.com
  Password: User123

  Email: user2@library.com
  Password: User123

  Email: user3@library.com
  Password: User123
```

---

## Quick Troubleshooting

### Problem: Port 5000 Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Problem: Cannot Connect to Database

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check database exists
psql -U postgres -l | grep lms_db

# Check .env file
cat backend/.env
```

### Problem: npm install Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific version
npm install --legacy-peer-deps
```

---

## What's Next?

After successful setup:

1. **Explore Features**
   - Try all pages
   - Test search and filters
   - Borrow and return books
   - Edit your profile

2. **Read Documentation**
   - [QUICK_START.md](QUICK_START.md) - Commands
   - [TESTING_GUIDE.md](TESTING_GUIDE.md) - Test scenarios
   - [MODULES_DOCUMENTATION.md](MODULES_DOCUMENTATION.md) - API docs

3. **Customize (Optional)**
   - Change colors in tailwind.config.js
   - Add more books to database
   - Modify borrowing period
   - Add new features

4. **Deploy (When Ready)**
   - Frontend → Vercel/Netlify
   - Backend → Heroku/Railway
   - Database → AWS RDS/Supabase

---

## Success Indicators

✅ **You've completed setup when:**
- Backend server shows "Server running on http://localhost:5000"
- Frontend shows "Local: http://localhost:5173"
- Browser loads http://localhost:5173
- Can login with admin@library.com / Admin123
- Dashboard displays without errors
- Can browse and borrow books

---

## Need Help?

📖 **Check:**
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed steps
2. [QUICK_START.md](QUICK_START.md) - Commands
3. [TESTING_GUIDE.md](TESTING_GUIDE.md) - Test scenarios
4. Troubleshooting section above

---

**🎉 Setup Complete! Ready to use your Library Management System!**
