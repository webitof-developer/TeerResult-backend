import express from 'express';
import {
  registerUser,
  getMe,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser
} from '../controller/userController.js';
import auth from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user (protected)
router.get('/me', auth, getMe);

// Get user profile (protected)
router.get('/:id', auth, getUserProfile);

// Update user (protected)
router.put('/:id', auth, upload.single('image'), updateUser);

// Delete user (protected, admin only)
router.delete('/:id', auth, deleteUser);

export default router;
