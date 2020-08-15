const mongoose = require('mongoose');
const { slugify } = require('../utils/commonHelpers');

const productsSchema = new mongoose.Schema(
  {
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
    model: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      immutable: true,
    },
    images: {
      preview: {
        type: String,
        trim: true,
      },
      catalog: [{ type: String, trim: true }],
    },
    price: {
      en: {
        type: Number,
      },
      ua: {
        type: Number,
      },
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0,
    },
    quantity: Number,
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    category: {
      child: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
      },
      parent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
      },
    },
    isUsed: {
      type: Boolean,
      required: true,
    },
    priority: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    selled: Number,
    details: {},
  },
  { timestamps: true }
);

productsSchema.pre('save', function (next) {
  this.slug = slugify(this.name.en);
  next();
});

module.exports = mongoose.model('Product', productsSchema);
