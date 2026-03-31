# 🚀 Complete Setup Guide - Library Management System

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js 16+ installed ([Download](https://nodejs.org/))
- ✅ PostgreSQL 12+ installed ([Download](https://www.postgresql.org/download/))
- ✅ Git (optional, for version control)

---

## Step 1: PostgreSQL Database Setup

### 1.1 Start PostgreSQL Service
**Windows:**
```bash
# PostgreSQL should auto-start, or restart it from Services
net start postgresql-x64-15
```

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### 1.2 Create Database and User

Open PostgreSQL command prompt:
```bash
psql -U postgres
```

Run these commands:
```sql
-- Create database
CREATE DATABASE lms_db;

-- Create user (if not exists)
CREATE USER postgres WITH PASSWORD 'postgres';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE lms_db TO postgres;

-- Connect to the database
\c lms_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO postgres;

-- Exit
\q
```

### 1.3 Run Database Migrations

Navigate to your project directory and run migrations in order:

```bash
# From project root directory
cd database/migrations

# Run each migration
psql -U postgres -d lms_db -f 001_create_users_table.sql
psql -U postgres -d lms_db -f 002_create_books_table.sql
psql -U postgres -d lms_db -f 003_create_transactions_table.sql
psql -U postgres -d lms_db -f 004_create_reservations_table.sql
```

### 1.4 Seed Sample Data

```bash
cd ../seeds

psql -U postgres -d lms_db -f 001_seed_users.sql
psql -U postgres -d lms_db -f 002_seed_books.sql
```

### 1.5 Verify Database Setup

Connect to the database and verify:
```bash
psql -U postgres -d lms_db

# List tables
\dt

# Check users table
SELECT * FROM users;

# Check books
SELECT COUNT(*) FROM books;

# Exit
\q
```

Expected output:
```
 Schema |     Name      | Type  | Owner
--------+---------------+-------+----------
 public | books         | table | postgres
 public | reservations  | table | postgres
 public | transactions  | table | postgres
 public | users         | table | postgres
(4 rows)
```

---

## Step 2: Environment Variables

### ✅ Already Created!

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

Both files are ready in:
- `backend/.env`
- `frontend/.env`

**⚠️ Important:** Change JWT_SECRET in production!

---

## Step 3: Install Dependencies

### 3.1 Backend Installation

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Verify installation
npm list
```

**Expected packages:**
- express
- pg (PostgreSQL driver)
- jsonwebtoken
- bcryptjs
- joi
- morgan
- cors
- dotenv

### 3.2 Frontend Installation

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Verify installation
npm list
```

**Expected packages:**
- react
- react-dom
- react-router-dom
- axios
- zustand
- tailwindcss
- vite

---

## Step 4: Start Development Servers

### 4.1 Start Backend Server

**Terminal 1:**
```bash
cd backend

# Start the server
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
Connected to database
```

### 4.2 Start Frontend Server

**Terminal 2:**
```bash
cd frontend

# Start the development server
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
➜  Press h to show help
```

⚠️ **Note:** Frontend may run on 3000 or 5173 depending on Vite config.

---

## Step 5: Test the Application

### 5.1 Health Check

**Backend API:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

### 5.2 Frontend Access

Open your browser and go to:
```
http://localhost:5173
```

or

```
http://localhost:3000
```

### 5.3 Test User Credentials

**Admin Account:**
```
Email: admin@library.com
Password: Admin123
```

**Regular User:**
```
Email: user1@library.com
Password: User123
```

### 5.4 Manual Testing Workflow

1. **Homepage**
   - ✅ Load homepage successfully
   - ✅ See featured books
   - ✅ Navigation bar displays correctly

2. **Authentication**
   - ✅ Login with admin credentials
   - ✅ Should redirect to dashboard
   - ✅ Token saved in localStorage

3. **Book Browsing**
   - ✅ Navigate to Catalog page
   - ✅ Search for books
   - ✅ Filter by category
   - ✅ Sort by title/author
   - ✅ View book details

4. **Borrowing**
   - ✅ Click "Borrow" on a book
   - ✅ Should appear in Dashboard
   - ✅ Check active transactions

5. **User Profile**
   - ✅ Click profile in navbar
   - ✅ View user information
   - ✅ Edit profile details
   - ✅ See borrowing rules

6. **Logout**
   - ✅ Click logout in dropdown
   - ✅ Should redirect to homepage
   - ✅ Token cleared from localStorage

### 5.5 Backend API Testing

Use **Postman** or **curl** to test endpoints:

**Register New User:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "Admin123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "name": "Admin User",
    "email": "admin@library.com",
    "role": "admin"
  }
}
```

**Get All Books:**
```bash
curl http://localhost:5000/api/books
```

**Search Books:**
```bash
curl "http://localhost:5000/api/books/search?title=JavaScript"
```

**Borrow a Book:**
```bash
curl -X POST http://localhost:5000/api/transactions/borrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "book_id": 1
  }'
```

**Return a Book:**
```bash
curl -X POST http://localhost:5000/api/transactions/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "transaction_id": 1
  }'
```

---

## Step 6: Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify .env database credentials
cat backend/.env | grep DB_
```

### npm Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Check backend CORS settings in server.js
- Frontend URL should match VITE_API_BASE_URL

### Migration Failed
```bash
# Check if database exists
psql -U postgres -l | grep lms_db

# If not, create it again
psql -U postgres -c "CREATE DATABASE lms_db"
```

---

## Step 7: Project Structure Reference

```
Online Library Management System/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── server.js
│   │   └── database.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_books_table.sql
│   │   ├── 003_create_transactions_table.sql
│   │   └── 004_create_reservations_table.sql
│   └── seeds/
│       ├── 001_seed_users.sql
│       └── 002_seed_books.sql
└── README.md
```

---

## Step 8: Useful Commands

### Backend
```bash
# Start development server
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# View dependencies
npm list
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

### Database
```bash
# Connect to database
psql -U postgres -d lms_db

# List databases
\l

# List tables
\dt

# Describe table
\d table_name

# View table data
SELECT * FROM table_name;

# Drop database (careful!)
DROP DATABASE lms_db;
```

---

## Step 9: Production Deployment

**Before deploying:**

1. **Update Environment Variables**
   ```bash
   NODE_ENV=production
   JWT_SECRET=<generate-strong-random-key>
   DB_HOST=<production-db-host>
   DB_USER=<production-db-user>
   DB_PASSWORD=<strong-password>
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   # Creates dist/ folder
   ```

3. **Deploy Options**
   - Vercel/Netlify (frontend)
   - Heroku/Railway/Render (backend)
   - AWS/GCP/Azure (full stack)

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `lms_db` created
- [ ] All 4 migrations executed
- [ ] Seed data loaded
- [ ] `.env` files created in backend and frontend
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server running on port 5000
- [ ] Frontend server running (port 5173 or 3000)
- [ ] Can access http://localhost:5173
- [ ] Can login with admin credentials
- [ ] Can browse books
- [ ] Can borrow/return books
- [ ] API endpoints responding correctly

---

## 🎉 You're All Set!

Your Library Management System is now running!

**Quick Links:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Database: PostgreSQL on localhost:5432

**Next Steps:**
- Customize styling in `frontend/src/index.css`
- Add more books to the database
- Implement email notifications
- Create admin dashboard pages
- Set up automated testing

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify all environment variables
3. Ensure PostgreSQL is running
4. Check port availability
5. Review console error messages

Good luck! 🚀
