import express from 'express'
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getAllUsers,
  deleteUser
} from '../controllers/userController.js'
import { validateUser } from '../middleware/validators.js'
import { verifyToken, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', validateUser, registerUser)
router.post('/login', loginUser)
router.get('/profile', verifyToken, getUserProfile)
router.put('/profile', verifyToken, updateUserProfile)
router.get('/', verifyToken, authorizeAdmin, getAllUsers)
router.delete('/:id', verifyToken, authorizeAdmin, deleteUser)

export default router
