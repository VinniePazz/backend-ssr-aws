const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getAllProducts = (req, res, next) => {
  if (req.body) {
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

exports.getProductsByFilter = async (req, res, next) => {
  if (!req.body) {
    return;
  }

  const category = await Category.findOne({ name: req.body.category });

  const products = await Product.find({ category: category._id });

  // {
  //   $group: {
  //     _id: null,
  //     minPrice: { $min: '$price' },
  //     maxPrice: { $max: '$price' },
  //     manufacturer: { $push: '$details.manufacturer' },
  //     cableType: { $push: '$details.cableType' },
  //     cableLength: { $push: '$details.cableLength' },
  //     somethingElse: { $push: '$details.somethingElse' },
  //     filters: { $objectToArray: 'details' },
  //   },
  // },

  // const aggregation = await Product.aggregate([
  //   { $match: { category: category._id } },
  //   {
  //     $group: {
  //       _id: null,
  //       minPrice: { $min: '$price' },
  //       maxPrice: { $max: '$price' },
  //     },
  //   },
  // ]);

  console.log('CATEGORY: ', category);
  console.log('PRODUCTS: ', products);

  const filterMap = {};

  category.filters.forEach((item, i) => {
    const filters = [];
    products.forEach((product) => {
      const filter = product.details[item];
      if (!filters.includes(filter) && filter) {
        filters.push(filter);
      }
    });
    filterMap[item] = filters;
  });

  console.log(filterMap);

  // products.forEach((item) => {});

  res.status(200).json({
    status: 'success',
    data: {
      products,
    },
  });
};

exports.getProduct = async (req, res, next) => {
  // 1. Fetch category from query param
  const category = await Category.findOne({ name: req.query.category });
  // 2. Check if it's top catagory
  const products = await Product.find({ category: req.query.category });

  res.json({ status: 'success', data: { category, products } });
};

exports.addProduct = async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newProduct,
    },
  });
};
