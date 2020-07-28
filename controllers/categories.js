const Category = require('../models/Category');

exports.addCategory = async (req, res, next) => {
  const category = {
    name: req.body.name,
    filters: req.body.filters,
    parent: req.body.parent,
  };

  const newCategory = await Category.create(category);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
};
