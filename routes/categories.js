const express = require('express');
const router = express.Router();

// import controller
const {
  addCategory,
  getCategory,
  getAllCategories,
} = require('../controllers/categories');

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', addCategory);

module.exports = router;
