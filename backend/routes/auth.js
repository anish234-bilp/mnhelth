const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const ALLOWED_EMAILS = process.env.ALLOWED_OWNER_EMAILS
  ? process.env.ALLOWED_OWNER_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(email.trim().toLowerCase())) {
      return res.status(403).json({
        message: 'This email is not authorised to register as an owner.'
      });
    }

    const existing = await Owner.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password,10)

    const owner = await Owner.create({ name, email, password:hashed });
    const token = generateToken(owner._id);

    res.status(201).json({
      message: 'Owner registered successfully',
      token,
      owner: { id: owner._id, name: owner.name, email: owner.email }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const owner = await Owner.findOne({ email });
    if (!owner || !(await owner.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(owner._id);

    res.json({
      message: 'Login successful',
      token,
      owner: { id: owner._id, name: owner.name, email: owner.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me — verify token
router.get('/me', protect, (req, res) => {
  res.json({ owner: req.owner });
});

module.exports = router;