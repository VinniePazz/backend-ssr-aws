const express = require('express');
const router = express.Router();

// import controller
const {
  getAllProducts,
  getProductsByFilter,
} = require('../controllers/products');

router.get('/', getAllProducts);
router.get('/', getProductsByFilter);

module.exports = router;
