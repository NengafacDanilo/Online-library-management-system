import pool from '../utils/database.js'

export class Search {
  static async searchBooks(query, filters = {}) {
    let sqlQuery = 'SELECT * FROM books WHERE 1=1'
    const params = []
    let paramIndex = 1

    // Search in title, author, isbn, category
    if (query) {
      sqlQuery += ` AND (title ILIKE $${paramIndex} OR author ILIKE $${paramIndex + 1} OR isbn ILIKE $${paramIndex + 2} OR category ILIKE $${paramIndex + 3})`
      const searchPattern = `%${query}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
      paramIndex += 4
    }

    // Filter by category
    if (filters.category) {
      sqlQuery += ` AND category ILIKE $${paramIndex}`
      params.push(`%${filters.category}%`)
      paramIndex++
    }

    // Filter by availability
    if (filters.available) {
      sqlQuery += ` AND available_copies > 0`
    }

    // Filter by availability range
    if (filters.minCopies !== undefined) {
      sqlQuery += ` AND available_copies >= $${paramIndex}`
      params.push(filters.minCopies)
      paramIndex++
    }

    // Sorting
    const sortBy = filters.sortBy || 'title'
    const sortOrder = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC'
    sqlQuery += ` ORDER BY ${sortBy} ${sortOrder}`

    // Pagination
    const limit = filters.limit || 20
    const offset = filters.offset || 0
    sqlQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await pool.query(sqlQuery, params)
    return result.rows
  }

  static async searchByAuthor(author) {
    const result = await pool.query(
      `SELECT * FROM books WHERE author ILIKE $1 ORDER BY title ASC`,
      [`%${author}%`]
    )
    return result.rows
  }

  static async searchByISBN(isbn) {
    const result = await pool.query(
      'SELECT * FROM books WHERE isbn = $1',
      [isbn]
    )
    return result.rows[0]
  }

  static async searchByCategory(category) {
    const result = await pool.query(
      'SELECT * FROM books WHERE category ILIKE $1 ORDER BY title ASC',
      [`%${category}%`]
    )
    return result.rows
  }

  static async getAvailableBooks() {
    const result = await pool.query(
      'SELECT * FROM books WHERE available_copies > 0 ORDER BY title ASC'
    )
    return result.rows
  }

  static async getCategories() {
    const result = await pool.query(
      `SELECT DISTINCT category FROM books WHERE category IS NOT NULL ORDER BY category ASC`
    )
    return result.rows.map(row => row.category)
  }

  static async getSearchStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_books,
        COUNT(DISTINCT category) as total_categories,
        SUM(available_copies) as total_available_copies,
        COUNT(CASE WHEN available_copies = 0 THEN 1 END) as unavailable_books
      FROM books
    `)
    return result.rows[0]
  }

  static async searchWithFilters(query, filters = {}) {
    return this.searchBooks(query, filters)
  }
}
