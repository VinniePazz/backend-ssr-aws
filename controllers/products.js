const Product = require('../models/Product');
const Category = require('../models/Category');
const {
  formatQuery,
  formatSort,
  transformcategoryFilter,
  updatePriceFilter,
} = require('../utils/productsHelpers');

exports.getProduct = async (req, res, next) => {
  const product = await Product.find({ slug: req.params.slug });

  res.json({ status: 'success', data: { product } });
};

exports.getProducts = async (req, res, next) => {
  const query = formatQuery(req.query);
  const limit = Number(req.query.limit) || 18;
  const skip = req.query.page ? (req.query.page - 1) * limit : 0;
  const sort = formatSort(req.query.sort);

  const categoryQuery = Category.findOne({ slug: req.query.category })
    .select('-_id type name slug filters')
    .lean();

  const productsQuery = Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(
      '-_id images discount isAvailable name price model isUsed details slug'
    )
    .lean();

  const [category, products] = await Promise.all([
    categoryQuery.exec(),
    productsQuery.exec(),
  ]);

  res.status(200).json({
    products,
    category,
  });
};

exports.addProduct = async (req, res, next) => {
  // 1. Fetch child category
  const category = await Category.findById(req.body.categoryId).lean();

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
  const updatedCategory = await Category.findByIdAndUpdate(
    req.body.categoryId,
    {
      filters: categoryFilters,
    },
    { new: true, upsert: true }
  );

  res.status(201).json({
    status: 'success',
    data: {
      category: updatedCategory,
      product: newProduct,
    },
  });
};
