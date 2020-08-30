const express = require('express');
const router = express.Router();

const {
  addCategory,
  getCategory,
  getCategoriesTree,
} = require('../controllers/categories');

router.get('/', getCategoriesTree);
router.get('/:id', getCategory);
router.post('/', addCategory);

module.exports = router;
