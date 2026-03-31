import { Transaction } from '../models/Transaction.js'
import { Book } from '../models/Book.js'

export const borrowBook = async (req, res) => {
  try {
    const { book_id, borrow_days = 7 } = req.body
    const userId = req.user?.userId || req.body.user_id

    if (!userId || !book_id) {
      return res.status(400).json({ error: 'User ID and Book ID are required' })
    }

    // Check if book exists
    const book = await Book.findById(book_id)
    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    if (book.available_copies === 0) {
      return res.status(400).json({ error: 'Book is not available' })
    }

    // Create transaction
    const transaction = await Transaction.borrowBook(userId, book_id, borrow_days)

    res.status(201).json({
      message: 'Book borrowed successfully',
      transaction,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const returnBook = async (req, res) => {
  try {
    const { transaction_id } = req.body
    const returnDate = req.body.return_date ? new Date(req.body.return_date) : new Date()

    if (!transaction_id) {
      return res.status(400).json({ error: 'Transaction ID is required' })
    }

    // Return book and calculate fine
    const transaction = await Transaction.returnBook(transaction_id, returnDate)

    res.status(200).json({
      message: 'Book returned successfully',
      fine: transaction.fine,
      transaction,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserBorrowingHistory = async (req, res) => {
  try {
    const userId = req.user?.userId || req.params.userId

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const history = await Transaction.getUserHistory(userId)

    res.status(200).json({
      message: 'Borrowing history retrieved',
      userId,
      count: history.length,
      history,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getActiveTransactions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.params.userId

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const transactions = await Transaction.getActiveTransactions(userId)

    res.status(200).json({
      message: 'Active transactions retrieved',
      userId,
      count: transactions.length,
      transactions,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Transaction.getOverdueBooks()

    res.status(200).json({
      message: 'Overdue books retrieved',
      count: overdueBooks.length,
      overdueBooks,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.getAllTransactions()

    res.status(200).json({
      message: 'All transactions retrieved',
      count: transactions.length,
      transactions,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
