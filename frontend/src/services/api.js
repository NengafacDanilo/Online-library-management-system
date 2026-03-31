import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const userService = {
  register: (name, email, password) =>
    api.post('/users/register', { name, email, password }),
  
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (name, email) =>
    api.put('/users/profile', { name, email }),
  
  getAllUsers: () =>
    api.get('/users'),
  
  deleteUser: (id) =>
    api.delete(`/users/${id}`),
}

export const bookService = {
  getAllBooks: (limit = 20, offset = 0) =>
    api.get('/books', { params: { limit, offset } }),
  
  getBookById: (id) =>
    api.get(`/books/${id}`),
  
  searchBooks: (query) =>
    api.get('/books/search', { params: { q: query } }),
  
  getBooksByCategory: (category, limit = 20, offset = 0) =>
    api.get(`/books/category/${category}`, { params: { limit, offset } }),
  
  createBook: (bookData) =>
    api.post('/books', bookData),
  
  updateBook: (id, bookData) =>
    api.put(`/books/${id}`, bookData),
  
  deleteBook: (id) =>
    api.delete(`/books/${id}`),
}

export const transactionService = {
  borrowBook: (book_id, borrow_days = 7) =>
    api.post('/transactions/borrow', { book_id, borrow_days }),
  
  returnBook: (transaction_id, return_date = null) =>
    api.post('/transactions/return', { transaction_id, return_date }),
  
  getUserHistory: (userId) =>
    api.get(`/transactions/history/${userId}`),
  
  getActiveTransactions: (userId) =>
    api.get(`/transactions/active/${userId}`),
  
  getOverdueBooks: () =>
    api.get('/transactions/overdue/list'),
  
  getAllTransactions: () =>
    api.get('/transactions'),
}

export default api
