const express = require('express');
const router = express.Router();

// import controller
const {
  addCategory,
  getCategory,
  getAllCategories,
  addFilterToCategory,
  editFilterInCategory,
} = require('../controllers/categories');

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', addCategory);
router.put('/filter', addFilterToCategory);
router.patch('/filter', editFilterInCategory);

module.exports = router;
