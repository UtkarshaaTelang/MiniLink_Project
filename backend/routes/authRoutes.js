const express = require('express');
const router = express.Router();

// Controller methods (to be implemented later)
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');


// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);

module.exports = router;
