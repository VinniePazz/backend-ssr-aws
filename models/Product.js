const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productsSchema);
