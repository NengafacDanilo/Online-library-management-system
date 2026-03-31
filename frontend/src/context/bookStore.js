import { create } from 'zustand'
import { bookService } from '../services/api'

export const useBookStore = create((set) => ({
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
  total: 0,
  limit: 20,
  offset: 0,

  getAllBooks: async (limit = 20, offset = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await bookService.getAllBooks(limit, offset)
      set({ 
        books: response.data.books, 
        total: response.data.total,
        limit,
        offset,
        isLoading: false 
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch books'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getBookById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await bookService.getBookById(id)
      set({ currentBook: response.data.book, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch book'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  searchBooks: async (query) => {
    set({ isLoading: true, error: null })
    try {
      const response = await bookService.searchBooks(query)
      set({ books: response.data.books, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Search failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getBooksByCategory: async (category, limit = 20, offset = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await bookService.getBooksByCategory(category, limit, offset)
      set({ books: response.data.books, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch category books'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  createBook: async (bookData) => {
    try {
      const response = await bookService.createBook(bookData)
      set((state) => ({
        books: [response.data.book, ...state.books],
      }))
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const response = await bookService.updateBook(id, bookData)
      set((state) => ({
        books: state.books.map((book) =>
          book.book_id === id ? response.data.book : book
        ),
      }))
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await bookService.deleteBook(id)
      set((state) => ({
        books: state.books.filter((book) => book.book_id !== id),
      }))
      return response.data
    } catch (error) {
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
