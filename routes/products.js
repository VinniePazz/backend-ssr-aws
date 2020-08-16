const express = require('express');
const router = express.Router();

// import controller
const {
  addProduct,
  getProduct,
  getProducts,
} = require('../controllers/products');

router.get('/:slug', getProduct);
router.get('/', getProducts);

// @route   POST /products
// @desc    Create new product and update filters in categories if needed
// @access  Private
router.post('/', addProduct);

module.exports = router;
