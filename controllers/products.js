const Product = require('../models/Product');

exports.getAllProducts = (req, res, next) => {
  if (req.query) {
    next();
    return;
  }
  Product.find({})
    .then((products) => {
      res.json({ status: 'success', data: products });
    })
    .catch((err) => {
      res.status(404).json({ success: false, error: err });
    });
};

exports.getProductsByFilter = (req, res, next) => {
  const search = /сма/gi;
  Product.find({ $or: [{ name: search }, { description: search }] })
    .then((products) => {
      res.json({ status: 'success', data: products });
    })
    .catch((err) => {
      res.status(404).json({ success: false, error: err });
    });
};
