import User from '../models/User.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../emailService.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ name, email, password, verificationToken });

    // UNCOMMENT THESE LINES NOW
    const verifyUrl = `http://localhost:5000/api/users/verify/${verificationToken}`;
    await sendVerificationEmail(email, verifyUrl);

    res.status(201).json({ message: "Registration successful. Please check your email to verify." });
  } catch (error) {
    console.error("Email Error:", error); // Logs the error if sending fails
    res.status(500).json({ message: "Registration successful, but failed to send verification email." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first." });
    
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};