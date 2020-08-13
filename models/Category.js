const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['parent', 'child'],
    },
    slug: {
      type: String,
      immutable: true,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    name: {
      en: {
        type: String,
        trim: true,
        unique: true,
        required: true,
      },
      ua: {
        type: String,
        trim: true,
        unique: true,
        required: true,
      },
    },
    parent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
    },
    children: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
      },
    ],
    filters: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
