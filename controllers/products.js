const Product = require('../models/Product');
const Category = require('../models/Category');
const {
  transformcategoryFilter,
  updatePriceFilter,
} = require('../utils/productsHelpers');

exports.getProducts = async (req, res, next) => {
  const category = await Category.findOne({ name: req.body.category });

  const products = await Product.find({ category: category._id });

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
  // 1. Fetch child category
  const category = await Category.findById(req.body.categoryId);

  // 2. Grab details from new product and filters from corresponding category
  const details = req.body.details;
  let categoryFilters = category.filters || {};

  // 3. Check and update price filter
  const newPriceFilter = updatePriceFilter(req.body.price, categoryFilters);
  if (newPriceFilter !== null) {
    categoryFilters.price = newPriceFilter;
  }

  // 4. Update other filters in category
  categoryFilters = transformcategoryFilter(details, categoryFilters);

  // 5. Save new product
  const newProduct = await Product.create(req.body);

  // 6. Save new category's filters
  const newCategory = await Category.findByIdAndUpdate(
    req.body.categoryId,
    {
      filters: categoryFilters,
    },
    { new: true, upsert: true }
  );

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
      product: newProduct,
    },
  });
};
