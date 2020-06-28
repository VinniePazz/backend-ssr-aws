const express = require('express');
const router = express.Router();

// import controller
const { signin } = require('../controllers/signin');

router.post('/', signin);

module.exports = router;