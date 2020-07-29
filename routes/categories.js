const express = require('express');
const router = express.Router();

// import controller
const { addCategory, getAllCategories } = require('../controllers/categories');

router.get('/', getAllCategories);
router.post('/', addCategory);

module.exports = router;
