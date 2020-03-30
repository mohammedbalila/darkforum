
const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },
});

CategorySchema.index({ slug: 1 });

module.exports = model('Category', CategorySchema, 'categories');
