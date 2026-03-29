const express = require('express');
const router = express.Router();
const Submission = require("../models/Submission")
const { protect } = require('../middleware/auth');

// POST /api/submissions — public, no auth needed
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, address, query } = req.body;

    if (!name || !email || !phone || !dateOfBirth || !address || !query) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const submission = await Submission.create({ name, email, phone, dateOfBirth, address, query });

    res.status(201).json({ message: 'Submission received successfully!', submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/submissions — protected, owners only
router.get('/', protect, async (req, res) => {
  try {
    const { search, sort = 'newest', page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { query: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [submissions, total] = await Promise.all([
      Submission.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
      Submission.countDocuments(query)
    ]);

    res.json({
      submissions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/submissions/:id — protected
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/submissions/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;