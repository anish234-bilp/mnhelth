const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin:'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });