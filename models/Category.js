const mongoose = require('mongoose');
const { slugify } = require('../utils/commonHelpers');

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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name.en);
  next();
});

module.exports = mongoose.model('Category', categorySchema);
