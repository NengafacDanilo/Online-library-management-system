import express from 'express'
import {
  borrowBook,
  returnBook,
  getUserBorrowingHistory,
  getActiveTransactions,
  getOverdueBooks,
  getAllTransactions
} from '../controllers/transactionController.js'
import { verifyToken, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

// User routes
router.post('/borrow', verifyToken, borrowBook)
router.post('/return', verifyToken, returnBook)
router.get('/history/:userId', verifyToken, getUserBorrowingHistory)
router.get('/active/:userId', verifyToken, getActiveTransactions)

// Admin routes
router.get('/overdue/list', verifyToken, authorizeAdmin, getOverdueBooks)
router.get('/', verifyToken, authorizeAdmin, getAllTransactions)

export default router
