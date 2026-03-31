# Library Management System - Modules Documentation

## Overview
This document provides detailed information about all implemented modules: User, Book, Transaction, and Search.

---

## 1. USER MODULE

### Backend Models (`User.js`)
User class with the following static methods:

| Method | Description | Parameters | Returns |
|--------|-------------|-----------|---------|
| `findById(id)` | Get user by ID | id: number | User object |
| `findByEmail(email)` | Get user by email | email: string | User object |
| `create(userData)` | Create new user | {name, email, password, role} | Created user object |
| `update(id, userData)` | Update user profile | id, {name?, email?} | Updated user object |
| `delete(id)` | Delete user | id: number | Deleted user object |
| `verifyPassword(storedPassword, inputPassword)` | Verify password with bcrypt | storedPassword, inputPassword | boolean |
| `getAllUsers()` | Get all users (admin) | none | Array of users |

### Backend Controllers (`userController.js`)
User controller endpoints:

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/register` | POST | Register new user | No |
| `/login` | POST | Login user & return JWT | No |
| `/profile` | GET | Get user profile | Yes |
| `/profile` | PUT | Update user profile | Yes |
| `/` | GET | Get all users | Admin |
| `/:id` | DELETE | Delete user | Admin |

### Frontend Store (`authStore.js`)
Zustand store for authentication:

```javascript
// Methods available
- login(email, password)
- register(name, email, password)
- logout()
- getProfile()
- updateProfile(name, email)
- clearError()

// State
- user: null | {user_id, name, email, role, created_at}
- token: null | string
- isLoading: boolean
- error: null | string
```

### Frontend Pages
- **LoginPage.jsx** - User login form
- **RegisterPage.jsx** - User registration form

---

## 2. BOOK MODULE

### Backend Models (`Book.js`)
Book class with the following static methods:

| Method | Description | Parameters | Returns |
|--------|-------------|-----------|---------|
| `findAll(limit, offset)` | Get all books with pagination | limit: 20, offset: 0 | Array of books |
| `findById(id)` | Get book by ID | id: number | Book object |
| `create(bookData)` | Add new book (admin) | {title, author, isbn, category, total_copies, description} | Created book object |
| `update(id, bookData)` | Update book details | id, bookData object | Updated book object |
| `delete(id)` | Delete book (admin) | id: number | Deleted book object |
| `searchBooks(searchTerm, fields)` | Search in title, author, isbn, category | searchTerm: string | Array of books |
| `getByCategory(category, limit, offset)` | Get books by category | category: string | Array of books |
| `updateAvailableCopies(bookId, amount)` | Update available copies | bookId, amount | Updated book object |
| `getTotalCount()` | Get total books count | none | number |

### Backend Controllers (`bookController.js`)
Book controller endpoints:

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/` | GET | Get all books (paginated) | No |
| `/:id` | GET | Get book by ID | No |
| `/search` | GET | Search books by query | No |
| `/category/:category` | GET | Get books by category | No |
| `/` | POST | Create book | Admin |
| `/:id` | PUT | Update book | Admin |
| `/:id` | DELETE | Delete book | Admin |

### Frontend Store (`bookStore.js`)
Zustand store for books:

```javascript
// Methods available
- getAllBooks(limit, offset)
- getBookById(id)
- searchBooks(query)
- getBooksByCategory(category, limit, offset)
- createBook(bookData)
- updateBook(id, bookData)
- deleteBook(id)
- clearError()

// State
- books: []
- currentBook: null
- isLoading: boolean
- error: null | string
- total: number
- limit: 20
- offset: 0
```

### Frontend Pages
- **CatalogPage.jsx** - Browse and search books

---

## 3. TRANSACTION MODULE

### Backend Models (`Transaction.js`)
Transaction class with the following static methods:

| Method | Description | Parameters | Returns |
|--------|-------------|-----------|---------|
| `borrowBook(userId, bookId, borrowDays)` | Borrow a book (transaction) | userId, bookId, borrowDays: 7 | Transaction object |
| `returnBook(transactionId, returnDate)` | Return book & calculate fine | transactionId, returnDate | Updated transaction with fine |
| `getUserHistory(userId)` | Get user's borrow history | userId: number | Array of transactions |
| `getActiveTransactions(userId)` | Get user's active borrows | userId: number | Array of active transactions |
| `getOverdueBooks()` | Get all overdue books (admin) | none | Array of overdue transactions |
| `getAllTransactions()` | Get all transactions (admin) | none | Array of all transactions |
| `calculateFine(dueDate, returnDate, ratePerDay)` | Calculate fine amount | dueDate, returnDate, ratePerDay: 1 | number (fine amount) |

#### Fine Calculation
```
Fine = (return_date - due_date) * rate_per_day
Default: $1 per day
```

### Backend Controllers (`transactionController.js`)
Transaction controller endpoints:

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/borrow` | POST | Borrow a book | User |
| `/return` | POST | Return a book | User |
| `/history/:userId` | GET | Get user's borrow history | User |
| `/active/:userId` | GET | Get user's active transactions | User |
| `/overdue/list` | GET | Get all overdue books | Admin |
| `/` | GET | Get all transactions | Admin |

### Frontend Store (`transactionStore.js`)
Zustand store for transactions:

```javascript
// Methods available
- borrowBook(bookId, borrowDays)
- returnBook(transactionId, returnDate)
- getUserHistory(userId)
- getActiveTransactions(userId)
- getOverdueBooks()
- getAllTransactions()
- clearError()

// State
- transactions: []
- currentTransaction: null
- isLoading: boolean
- error: null | string
- userHistory: []
- activeTransactions: []
- overdueBooks: []
```

---

## 4. SEARCH MODULE

### Backend Models (`Search.js`)
Search class with advanced filtering:

| Method | Description | Parameters | Returns |
|--------|-------------|-----------|---------|
| `searchBooks(query, filters)` | Advanced book search with filters | query: string, filters: {} | Array of books |
| `searchByAuthor(author)` | Search by author name | author: string | Array of books |
| `searchByISBN(isbn)` | Search by exact ISBN | isbn: string | Single book object |
| `searchByCategory(category)` | Search by category | category: string | Array of books |
| `getAvailableBooks()` | Get only available books | none | Array of available books |
| `getCategories()` | Get all unique categories | none | Array of category names |
| `getSearchStats()` | Get search statistics | none | {total_books, total_categories, total_available_copies, unavailable_books} |

#### Search Filters
```javascript
{
  query: string,           // Search term
  category: string,        // Filter by category
  available: boolean,      // Only available books
  minCopies: number,       // Minimum available copies
  sortBy: string,          // Sort field (title, author, category)
  sortOrder: 'ASC' | 'DESC',
  limit: number,           // Results per page (default: 20)
  offset: number           // Pagination offset (default: 0)
}
```

---

## 5. API SERVICE (`api.js`)

### Frontend API Service
Axios instance with automatic token attachment:

```javascript
// User Service
- userService.register(name, email, password)
- userService.login(email, password)
- userService.getProfile()
- userService.updateProfile(name, email)
- userService.getAllUsers()
- userService.deleteUser(id)

// Book Service
- bookService.getAllBooks(limit, offset)
- bookService.getBookById(id)
- bookService.searchBooks(query)
- bookService.getBooksByCategory(category, limit, offset)
- bookService.createBook(bookData)
- bookService.updateBook(id, bookData)
- bookService.deleteBook(id)

// Transaction Service
- transactionService.borrowBook(book_id, borrow_days)
- transactionService.returnBook(transaction_id, return_date)
- transactionService.getUserHistory(userId)
- transactionService.getActiveTransactions(userId)
- transactionService.getOverdueBooks()
- transactionService.getAllTransactions()
```

---

## 6. DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  category VARCHAR(100),
  total_copies INT NOT NULL CHECK (total_copies > 0),
  available_copies INT NOT NULL CHECK (available_copies >= 0),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP NOT NULL,
  return_date TIMESTAMP,
  fine DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
  reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'fulfilled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. AUTHENTICATION & AUTHORIZATION

### JWT Token
```javascript
// Token payload
{
  userId: number,
  email: string,
  role: 'admin' | 'user',
  expiresIn: process.env.JWT_EXPIRE || '7d'
}
```

### Role-Based Access
- **User**: Can borrow/return books, view own profile, see book catalog
- **Admin**: Can manage books, manage users, view all transactions, see overdue books

### Protected Routes
```
GET /api/users/profile           - User
PUT /api/users/profile           - User
POST /api/transactions/borrow    - User
POST /api/transactions/return    - User
GET /api/transactions/history/:userId - User

GET /api/users                   - Admin
DELETE /api/users/:id            - Admin
POST /api/books                  - Admin
PUT /api/books/:id               - Admin
DELETE /api/books/:id            - Admin
GET /api/transactions/overdue    - Admin
GET /api/transactions            - Admin
```

---

## 8. USAGE EXAMPLES

### Example: User Registration
```javascript
// Frontend
const { register } = useAuthStore()
await register('John Doe', 'john@example.com', 'password123')

// Backend: POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}

// Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-03-30T10:00:00Z"
  }
}
```

### Example: Borrow Book
```javascript
// Frontend
const { borrowBook } = useTransactionStore()
await borrowBook(5, 7) // bookId: 5, borrowDays: 7

// Backend: POST /api/transactions/borrow
{
  "book_id": 5,
  "borrow_days": 7
}

// Response: 201 Created
{
  "message": "Book borrowed successfully",
  "transaction": {
    "transaction_id": 1,
    "user_id": 1,
    "book_id": 5,
    "issue_date": "2026-03-30T10:00:00Z",
    "due_date": "2026-04-06T10:00:00Z",
    "return_date": null,
    "fine": 0,
    "status": "borrowed"
  }
}
```

### Example: Return Book with Fine
```javascript
// Book returned 3 days late
// Due date: 2026-04-06
// Return date: 2026-04-09

// Fine = (2026-04-09 - 2026-04-06) * $1 = $3

// Response: 200 OK
{
  "message": "Book returned successfully",
  "fine": 3.00,
  "transaction": {
    "transaction_id": 1,
    "return_date": "2026-04-09T10:00:00Z",
    "fine": 3.00,
    "status": "returned"
  }
}
```

---

## 9. ERROR HANDLING

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

### Error Response Format
```javascript
{
  "error": "Description of the error"
}
```

---

## 10. NEXT STEPS

1. Install dependencies in both frontend and backend
2. Set up PostgreSQL database
3. Run database migrations
4. Configure environment variables (.env files)
5. Start backend server: `npm run dev`
6. Start frontend server: `npm run dev`
7. Access application at `http://localhost:3000`
