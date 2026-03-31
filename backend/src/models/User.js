import pool from '../utils/database.js'
import bcrypt from 'bcryptjs'

export class User {
  static async findById(id) {
    const result = await pool.query(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = $1',
      [id]
    )
    return result.rows[0]
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0]
  }

  static async create(userData) {
    const { name, email, password, role = 'user' } = userData
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role, created_at',
      [name, email, hashedPassword, role]
    )
    return result.rows[0]
  }

  static async update(id, userData) {
    const { name, email } = userData
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING user_id, name, email, role, created_at',
      [name || null, email || null, id]
    )
    return result.rows[0]
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING user_id',
      [id]
    )
    return result.rows[0]
  }

  static async verifyPassword(storedPassword, inputPassword) {
    return await bcrypt.compare(inputPassword, storedPassword)
  }

  static async getAllUsers() {
    const result = await pool.query(
      'SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    )
    return result.rows
  }
}
