const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    parent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
    },
    filters: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
