const express = require('express');
const router = express.Router();

// import controller
const { resetPassword } = require('../controllers/reset-password');

router.put('/', resetPassword);

module.exports = router;
