const express = require('express');
const router = express.Router();

// import controller
const { forgotPassword } = require('../controllers/forgot-password');

router.put('/', forgotPassword);

module.exports = router;
