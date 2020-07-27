const Product = require('../models/Product');

exports.getAllProducts = (req, res, next) => {
  if (req.query) {
    console.log(req);
    next();
    return;
  }
  Product.find({})
    .then((products) => {
      console.log(products);
      res.json({ status: 'success', data: products });
    })
    .catch((err) => {
      res.status(404).json({ success: false, error: err });
    });
};

exports.getProductsByFilter = (req, res, next) => {
  if (!req.query) {
    return;
  }
  const search = /сма/gi;
  Product.find({ $or: [{ name: search }, { description: search }] })
    .then((products) => {
      res.json({ status: 'success', data: products });
    })
    .catch((err) => {
      res.status(404).json({ success: false, error: err });
    });
};

exports.getProduct = async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.json({ status: 'success', data: product });
};
