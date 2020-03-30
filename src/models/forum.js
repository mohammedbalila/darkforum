
const { Schema, model } = require('mongoose');

const ForumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },

  description: {
    type: String,
  },

  parentForum: {
    type: Schema.Types.ObjectId,
    ref: 'Forum',
  },

  slug: {
    type: String,
    required: true,
  },

  threads: {
    type: [Schema.Types.ObjectId],
    ref: 'Thread',
    default: [],
  },

  publishedAt: {
    type: Date,
    default: Date.now(),
  },

});

ForumSchema.index({ slug: 1 });

module.exports = model('Forum', ForumSchema);
