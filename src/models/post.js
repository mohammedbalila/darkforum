
const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Thread',
  },

  text: {
    type: String,
    required: true,
  },

  publishedAt: {
    type: Date,
    default: Date.now(),
  },


});

PostSchema.index({ slug: 1 });

module.exports = model('Post', PostSchema);
