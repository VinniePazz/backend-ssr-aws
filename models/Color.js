const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schemaema(
  {
    name: {
      type: String,
      required: true,
    },
    cssValue: {
      type: String,
    },
  },
  { strict: false }
);

module.exports = mongoose.model('Color', ColorSchema);
