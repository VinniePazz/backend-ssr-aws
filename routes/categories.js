const express = require('express');
const router = express.Router();

// import controller
const { addCategory } = require('../controllers/categories');

router.post('/', addCategory);

module.exports = router;
