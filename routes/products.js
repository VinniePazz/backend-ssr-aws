const express = require('express');
const router = express.Router();

// import controller
const {
  addProduct,
  getProduct,
  getAllProducts,
  getProductsByFilter,
} = require('../controllers/products');

router.get('/', getAllProducts);
router.get('/', getProductsByFilter);
router.get('/filter/', getProduct);

// @route   POST /products
// @desc    Create new product and update filters in categories if needed
// @access  Private
router.post('/', addProduct);

module.exports = router;
