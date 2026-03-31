import express from 'express'
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory
} from '../controllers/bookController.js'
import { validateBook } from '../middleware/validators.js'
import { verifyToken, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getAllBooks)
router.get('/search', searchBooks)
router.get('/category/:category', getBooksByCategory)
router.get('/:id', getBookById)

// Admin routes
router.post('/', verifyToken, authorizeAdmin, validateBook, createBook)
router.put('/:id', verifyToken, authorizeAdmin, validateBook, updateBook)
router.delete('/:id', verifyToken, authorizeAdmin, deleteBook)

export default router
