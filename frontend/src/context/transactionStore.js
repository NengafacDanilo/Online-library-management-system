import { create } from 'zustand'
import { transactionService } from '../services/api'

export const useTransactionStore = create((set) => ({
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
  userHistory: [],
  activeTransactions: [],
  overdueBooks: [],

  borrowBook: async (bookId, borrowDays = 7) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.borrowBook(bookId, borrowDays)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to borrow book'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  returnBook: async (transactionId, returnDate = null) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.returnBook(transactionId, returnDate)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to return book'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getUserHistory: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.getUserHistory(userId)
      set({ userHistory: response.data.history, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch history'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getActiveTransactions: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.getActiveTransactions(userId)
      set({ activeTransactions: response.data.transactions, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch active transactions'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getOverdueBooks: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.getOverdueBooks()
      set({ overdueBooks: response.data.overdueBooks, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch overdue books'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getAllTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.getAllTransactions()
      set({ transactions: response.data.transactions, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch transactions'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
