const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = await Owner.findById(decoded.id).select('-password');
    if (!req.owner) {
      return res.status(401).json({ message: 'Owner not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };