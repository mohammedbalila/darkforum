const _ = require('lodash');
const { Thread, Post, Forum } = require('../models');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  createThread: async (req, res, next) => {
    try {
      const fields = _.pick(req.body, ['forum', 'title', 'text']);
      const thread = new Thread(fields);
      thread.author = req.user.id;
      thread.slug = thread.title.toLowerCase().split(' ').join('-');
      await thread.save();
      await Forum.updateOne(
        { _id: thread.forum },
        {
          $push: { threads: thread.id },
        },
      );
      return res.json({ thread, error: false });
    } catch (error) {
      return next(error);
    }
  },

  findThreadBySlug: async (req, res, next) => {
    const { slug } = req.params;
    try {
      const thread = await Thread.findOne({ slug })
        .populate('author', '_id username', 'user')
        .populate({
          path: 'posts',
          select: 'text author',
          model: 'Post',
          populate: { path: 'author', select: 'username', model: 'user' },
        });
      // .populate('threads', '_id title slug', 'Thread');
      if (!thread) {
        return res.status(404).json('Thread not found');
      }
      return res.json({ thread });
    } catch (error) {
      return next(error);
    }
  },

  findAllThreads: async (req, res, next) => {
    const { limit, offset, forum } = req.query;
    try {
      const query = Thread.find({ forum });

      if (limit && offset) {
        const threads = await query.limit(+limit).skip(+offset);
        return res.json({ threads });
      }
      const threads = await query.limit(10);
      return res.json({ threads });
    } catch (error) {
      return next(error);
    }
  },

  getThreadsByUser: async (req, res, next) => {
    const { username } = req.params;
    try {
      const threads = await Thread.find({
        'author.username': username,
      }).populate('author', '_id firstName lastName username', 'User');
      return res.json({ threads });
    } catch (error) {
      return next(error);
    }
  },

  findThread: async (req, res, next) => {
    const { id } = req.params;
    try {
      const threads = await Thread.findById(id);
      return res.json({ threads });
    } catch (error) {
      return next(error);
    }
  },

  getPosts: async (req, res, next) => {
    const { threadId: thread } = req.params;
    try {
      const posts = await Post.find({ thread });
      return res.json({ posts });
    } catch (error) {
      return next(error);
    }
  },

  deleteThread: async (req, res, next) => {
    const { id } = req.params;
    try {
      await Thread.findByIdAndDelete(id);
      await Post.deleteMany({ thread: id });
      return res.json({ message: 'deleted successfully', error: false });
    } catch (error) {
      return next(error);
    }
  },
};
