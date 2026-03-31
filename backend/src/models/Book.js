import pool from '../utils/database.js'

export class Book {
  static async findAll(limit = 20, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM books ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )
    return result.rows
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM books WHERE book_id = $1',
      [id]
    )
    return result.rows[0]
  }

  static async create(bookData) {
    const { title, author, isbn, category, total_copies, description } = bookData

    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, category, total_copies, available_copies, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, author, isbn, category, total_copies, total_copies, description || null]
    )
    return result.rows[0]
  }

  static async update(id, bookData) {
    const { title, author, isbn, category, total_copies, description } = bookData

    const result = await pool.query(
      `UPDATE books 
       SET title = COALESCE($1, title), 
           author = COALESCE($2, author), 
           isbn = COALESCE($3, isbn), 
           category = COALESCE($4, category), 
           total_copies = COALESCE($5, total_copies),
           description = COALESCE($6, description),
           updated_at = CURRENT_TIMESTAMP 
       WHERE book_id = $7 
       RETURNING *`,
      [title || null, author || null, isbn || null, category || null, total_copies || null, description || null, id]
    )
    return result.rows[0]
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM books WHERE book_id = $1 RETURNING book_id',
      [id]
    )
    return result.rows[0]
  }

  static async searchBooks(searchTerm, searchFields = ['title', 'author', 'isbn', 'category']) {
    let query = 'SELECT * FROM books WHERE '
    const conditions = searchFields.map(field => `${field} ILIKE $1`)
    query += conditions.join(' OR ')
    query += ' ORDER BY title ASC'

    const searchPattern = `%${searchTerm}%`
    const result = await pool.query(query, [searchPattern])
    return result.rows
  }

  static async getByCategory(category, limit = 20, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM books WHERE category ILIKE $1 ORDER BY title ASC LIMIT $2 OFFSET $3',
      [`%${category}%`, limit, offset]
    )
    return result.rows
  }

  static async updateAvailableCopies(bookId, amount) {
    const result = await pool.query(
      'UPDATE books SET available_copies = available_copies + $1, updated_at = CURRENT_TIMESTAMP WHERE book_id = $2 RETURNING *',
      [amount, bookId]
    )
    return result.rows[0]
  }

  static async getTotalCount() {
    const result = await pool.query('SELECT COUNT(*) as count FROM books')
    return parseInt(result.rows[0].count)
  }
}
