const express = require('express');
const router = express.Router();

// Import controller functions
const { getMessage } = require('../controllers/indexController');

// Define routes
router.get('/message', getMessage);

module.exports = router;
