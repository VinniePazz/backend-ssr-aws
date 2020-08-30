const Category = require('../models/Category');

exports.addCategory = async (req, res, next) => {
  const { name, type, parentId } = req.body;

  const category = {
    type,
    name,
    parent: parentId,
  };

  const newCategory = await Category.create(category);

  // push newly child category to parent children ref array
  let parentCategory;
  if (type === 'child' && parentId) {
    await Category.findByIdAndUpdate(parentId, {
      $push: { children: newCategory._id },
    });
  }

  res.status(201).json({
    status: 'success',
    data: { newCategory, parentCategory },
  });
};

exports.getCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('children');

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
};

exports.getCategoriesTree = async (req, res, next) => {
  const categories = await Category.find({ type: 'parent' })
    .select('slug type name children')
    .populate({
      path: 'children',
      select: 'name slug type -_id',
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      categories,
    },
  });
};
