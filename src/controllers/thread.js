const _ = require('lodash');
const { Thread, Post, Forum } = require('../models');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  createThread: async (req, res, next) => {
    try {
      const fields = _.pick(req.body, ['forum', 'title']);
      const thread = new Thread(fields);
      thread.author = req.user.id;
      thread.slug = thread.title
        .toLowerCase()
        .split(' ')
        .join('-');
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
