
const { Schema, model } = require('mongoose');

const ThreadSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  forum: {
    type: Schema.Types.ObjectId,
    ref: 'Forum',
  },

  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  contributors: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },

  posts: {
    type: [Schema.Types.ObjectId],
    ref: 'Post',
  },

  publishedAt: {
    type: Date,
    default: Date.now(),
  },


});

ThreadSchema.index({ slug: 1 });

module.exports = model('Thread', ThreadSchema);
