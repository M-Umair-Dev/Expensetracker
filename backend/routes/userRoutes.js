import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getUsers, deleteUser } from '../controllers/adminController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admin/users', protect, admin, getUsers);
router.delete('/admin/users/:id', protect, admin, deleteUser);
// Verification Route
router.get('/verify/:token', async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });
  if (!user) return res.status(400).json({ message: "Invalid token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.send("<h1>Email Verified!</h1><p>You can now log in.</p>");
});

export default router;