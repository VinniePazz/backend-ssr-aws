const express = require('express');
const router = express.Router();

// import controller
const {
  getProduct,
  getAllProducts,
  getProductsByFilter,
} = require('../controllers/products');

router.get('/', getAllProducts);
router.get('/', getProductsByFilter);
router.get('/:id', getProduct);

module.exports = router;
