const express = require('express');
const router = express.Router();

// import controller
const { googleLogin } = require('../controllers/google-login');

router.put('/', googleLogin);

module.exports = router;
