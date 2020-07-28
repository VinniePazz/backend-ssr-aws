const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
    },
    model: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    images: [String],
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    details: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productsSchema);
