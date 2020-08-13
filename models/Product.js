const mongoose = require('mongoose');

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
      unique: true,
      lowercase: true,
      immutable: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    images: {
      preview: {
        type: String,
        trim: true,
        required: true,
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
    isNew: {
      type: Boolean,
      required: true,
    },
    priority: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    details: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productsSchema);
