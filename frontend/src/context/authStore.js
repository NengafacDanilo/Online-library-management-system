import { create } from 'zustand'
import { userService } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await userService.login(email, password)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ token, user, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await userService.register(name, email, password)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  getProfile: async () => {
    try {
      const response = await userService.getProfile()
      set({ user: response.data.user })
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateProfile: async (name, email) => {
    try {
      const response = await userService.updateProfile(name, email)
      set({ user: response.data.user })
      return response.data
    } catch (error) {
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
