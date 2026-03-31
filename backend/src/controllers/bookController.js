import { Book } from '../models/Book.js'

export const getAllBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const books = await Book.findAll(limit, offset)
    const total = await Book.getTotalCount()

    res.status(200).json({
      message: 'Books retrieved successfully',
      total,
      count: books.length,
      limit,
      offset,
      books,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params

    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    res.status(200).json({
      message: 'Book retrieved successfully',
      book,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createBook = async (req, res) => {
  try {
    const bookData = req.validatedData

    const book = await Book.create(bookData)

    res.status(201).json({
      message: 'Book created successfully',
      book,
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'ISBN already exists' })
    }
    res.status(500).json({ error: error.message })
  }
}

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params
    const bookData = req.validatedData

    const book = await Book.update(id, bookData)
    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params

    const result = await Book.delete(id)
    if (!result) {
      return res.status(404).json({ error: 'Book not found' })
    }

    res.status(200).json({
      message: 'Book deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const searchBooks = async (req, res) => {
  try {
    const { q, category } = req.query

    let books

    if (!q && category) {
      books = await Book.getByCategory(category)
    } else if (q) {
      books = await Book.searchBooks(q)
    } else {
      return res.status(400).json({ error: 'Search query or category is required' })
    }

    res.status(200).json({
      message: 'Books found',
      count: books.length,
      books,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const books = await Book.getByCategory(category, limit, offset)

    res.status(200).json({
      message: 'Books retrieved successfully',
      category,
      count: books.length,
      books,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
