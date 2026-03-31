import pool from '../utils/database.js'

export class Transaction {
  static async borrowBook(userId, bookId, borrowDays = 7) {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Check if book is available
      const bookResult = await client.query(
        'SELECT available_copies FROM books WHERE book_id = $1',
        [bookId]
      )

      if (!bookResult.rows[0] || bookResult.rows[0].available_copies === 0) {
        throw new Error('Book not available')
      }

      // Calculate due date
      const issueDate = new Date()
      const dueDate = new Date(issueDate.getTime() + borrowDays * 24 * 60 * 60 * 1000)

      // Create transaction
      const transactionResult = await client.query(
        `INSERT INTO transactions (user_id, book_id, issue_date, due_date, status) 
         VALUES ($1, $2, $3, $4, 'borrowed') 
         RETURNING *`,
        [userId, bookId, issueDate, dueDate]
      )

      // Update available copies
      await client.query(
        'UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1',
        [bookId]
      )

      await client.query('COMMIT')
      return transactionResult.rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async returnBook(transactionId, returnDate = new Date()) {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Get transaction details
      const transactionResult = await client.query(
        'SELECT * FROM transactions WHERE transaction_id = $1',
        [transactionId]
      )

      const transaction = transactionResult.rows[0]
      if (!transaction) {
        throw new Error('Transaction not found')
      }

      // Calculate fine
      const dueDate = new Date(transaction.due_date)
      const fine = this.calculateFine(dueDate, returnDate)

      // Update transaction
      const updatedTransaction = await client.query(
        `UPDATE transactions 
         SET return_date = $1, fine = $2, status = 'returned', updated_at = CURRENT_TIMESTAMP 
         WHERE transaction_id = $3 
         RETURNING *`,
        [returnDate, fine, transactionId]
      )

      // Update available copies
      await client.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = $1',
        [transaction.book_id]
      )

      await client.query('COMMIT')
      return updatedTransaction.rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async getUserHistory(userId) {
    const result = await pool.query(
      `SELECT t.*, b.title, b.author, b.isbn, b.category, u.name, u.email
       FROM transactions t
       JOIN books b ON t.book_id = b.book_id
       JOIN users u ON t.user_id = u.user_id
       WHERE t.user_id = $1
       ORDER BY t.issue_date DESC`,
      [userId]
    )
    return result.rows
  }

  static async getActiveTransactions(userId) {
    const result = await pool.query(
      `SELECT t.*, b.title, b.author, b.isbn
       FROM transactions t
       JOIN books b ON t.book_id = b.book_id
       WHERE t.user_id = $1 AND t.status = 'borrowed'
       ORDER BY t.due_date ASC`,
      [userId]
    )
    return result.rows
  }

  static async getOverdueBooks() {
    const result = await pool.query(
      `SELECT t.*, b.title, b.author, u.name, u.email
       FROM transactions t
       JOIN books b ON t.book_id = b.book_id
       JOIN users u ON t.user_id = u.user_id
       WHERE t.status = 'borrowed' AND t.due_date < CURRENT_TIMESTAMP
       ORDER BY t.due_date ASC`
    )
    return result.rows
  }

  static calculateFine(dueDate, returnDate, ratePerDay = 1) {
    const due = new Date(dueDate)
    const returned = new Date(returnDate)
    const diffTime = returned - due
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays * ratePerDay : 0
  }

  static async getAllTransactions() {
    const result = await pool.query(
      `SELECT t.*, b.title, b.author, u.name, u.email
       FROM transactions t
       JOIN books b ON t.book_id = b.book_id
       JOIN users u ON t.user_id = u.user_id
       ORDER BY t.issue_date DESC`
    )
    return result.rows
  }
}
