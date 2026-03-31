import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.validatedData

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Create user
    const user = await User.create({ name, email, password, role: 'user' })

    res.status(201).json({
      message: 'User registered successfully',
      user,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(user.password, password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    // Extract user ID from JWT token (added by verifyToken middleware)
    const userId = req.user?.userId || req.params.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      message: 'User profile retrieved',
      user,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.params.id
    const { name, email } = req.body

    const user = await User.update(userId, { name, email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      message: 'User profile updated successfully',
      user,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers()
    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const result = await User.delete(id)
    if (!result) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
