
const _ = require('lodash');
const { Post } = require('../models');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  createPost: async (req, res, next) => {
    try {
      const fields = _.pick(req.body, ['text', 'thread']);
      const post = new Post(fields);
      post.author = req.user.id;
      await post.save();
      return res.json({ post, error: false });
    } catch (error) {
      return next(error);
    }
  },

  findAllPosts: async (req, res, next) => {
    const { limit, offset, thread } = req.query;
    try {
      const query = Post.find({ thread });
      if (limit && offset) {
        const posts = await query
          .limit(+limit)
          .skip(+offset);
        return res.json({ posts });
      }
      const posts = await query
        .limit(10);
      return res.json({ posts });
    } catch (error) {
      return next(error);
    }
  },

  getPostsByUser: async (req, res, next) => {
    const { userId: author } = req.params;
    try {
      const books = await Post.find({ author })
        .populate('author', '_id firstName lastName', 'User');
      return res.json({ books });
    } catch (error) {
      return next(error);
    }
  },

  findPost: async (req, res, next) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id);
      return res.json({ post });
    } catch (error) {
      return next(error);
    }
  },

  updatePost: async (req, res, next) => {
    const { id: _id } = req.params;
    const updatedFields = _.pick(req.body, ['text']);
    try {
      await Post.updateOne({ _id }, updatedFields, { runValidators: true });
      return res.json({ message: 'updated successfully', error: false });
    } catch (error) {
      return next(error);
    }
  },

  deletePost: async (req, res, next) => {
    const { id } = req.params;
    try {
      await Post.findByIdAndDelete(id);
      return res.json({ message: 'deleted successfully', error: false });
    } catch (error) {
      return next(error);
    }
  },

};
