const _ = require('lodash');
const { Forum, Thread } = require('../models');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  createForum: async (req, res, next) => {
    try {
      const fields = _.pick(req.body, [
        'name',
        'category',
        'description',
        'parentForum',
      ]);
      const forum = new Forum(fields);
      forum.author = req.user.id;
      forum.slug = forum.name
        .toLowerCase()
        .split(' ')
        .join('-');
      await forum.save();
      return res.json({ forum, error: false });
    } catch (error) {
      return next(error);
    }
  },

  findAllForums: async (req, res, next) => {
    const { limit, offset } = req.query;
    try {
      const query = Forum.find();
      if (limit && offset) {
        const forums = await query.limit(+limit).skip(+offset);
        return res.json({ forums });
      }
      const forums = await query.limit(10);
      return res.json({ forums });
    } catch (error) {
      return next(error);
    }
  },

  findForum: async (req, res, next) => {
    const { id } = req.params;
    try {
      const forum = await Forum.findById(id);
      if (!forum) {
        return res.status(404).json('Forum not found');
      }
      return res.json({ forum });
    } catch (error) {
      return next(error);
    }
  },

  findForumBySlug: async (req, res, next) => {
    const { slug } = req.query;
    try {
      const forum = await Forum.findOne({ slug });
      if (!forum) {
        return res.status(404).json('Forum not found');
      }
      return res.json({ forum });
    } catch (error) {
      return next(error);
    }
  },

  getThreads: async (req, res, next) => {
    const { forumId: forum } = req.params;
    try {
      const threads = await Thread.find({ forum });
      return res.json({ threads });
    } catch (error) {
      return next(error);
    }
  },

  deleteForum: async (req, res, next) => {
    const { id } = req.params;
    try {
      await Forum.findByIdAndDelete(id);
      await Thread.deleteMany({ forum: id });
      return res.json({ message: 'deleted successfully', error: false });
    } catch (error) {
      return next(error);
    }
  },
};
