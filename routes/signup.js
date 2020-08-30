const express = require('express');
const router = express.Router();

// import controller
const { signup } = require('../controllers/signup');

router.post('/', signup);

module.exports = router;