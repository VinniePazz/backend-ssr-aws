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
router.get('/filter/:productFilter', getProduct);
router.post('/', addProduct);

module.exports = router;
