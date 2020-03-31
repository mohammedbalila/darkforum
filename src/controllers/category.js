const _ = require('lodash');
const { Category, Forum } = require('../models');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  createCategory: async (req, res, next) => {
    try {
      const fields = _.pick(req.body, ['name', 'slug']);
      const category = new Category(fields);
      await category.save();
      return res.json({ message: 'Category was created', error: false });
    } catch (error) {
      return next(error);
    }
  },

  findAllCategories: async (req, res, next) => {
    const { limit, offset } = req.query;
    try {
      if (limit && offset) {
        const categories = await Category.find()
          .limit(+limit)
          .skip(+offset);
        return res.json({ categories });
      }
      const categories = await Category.find().limit(10);
      return res.json({ categories });
    } catch (error) {
      return next(error);
    }
  },

  findCategory: async (req, res, next) => {
    const { id: _id } = req.params;
    try {
      const category = await Category.findOne({ _id });
      const forums = await Forum.find(
        { category: _id },
        {
          name: 1,
          slug: 1,
        },
      )
        .limit(3)
        .sort('publishedAt');

      if (!category) {
        return res.status(404).json({ message: 'Category was not found' });
      }
      // category.forums = forums;
      return res.json({ category: { ...category.toJSON(), forums } });
    } catch (error) {
      return next(error);
    }
  },

  findCategoryBySlug: async (req, res, next) => {
    const { slug } = req.params;
    try {
      const category = await Category.findOne({ slug });
      const forums = await Forum.find(
        { category: category.id },
        {
          name: 1,
          slug: 1,
        },
      )
        .limit(3)
        .sort('publishedAt');

      if (!category) {
        return res.status(404).json({ message: 'Category was not found' });
      }
      // category.forums = forums;
      return res.json({ category: { ...category.toJSON(), forums } });
    } catch (error) {
      return next(error);
    }
  },

  updateCategory: async (req, res, next) => {
    const fields = _.pick(req.body, ['name', 'slug']);
    const { id: _id } = req.params;
    try {
      // eslint-disable-next-line no-unused-vars
      const category = await Category.updateOne({ _id }, fields, {
        runValidators: true,
      });
      return res.json({ message: 'updated successfully' });
    } catch (error) {
      return next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    const { id: _id } = req.params;
    try {
      // eslint-disable-next-line no-unused-vars
      const category = await Category.deleteOne({ _id });
      return res.json({ message: 'Deleted successfully' });
    } catch (error) {
      return next(error);
    }
  },

  getForums: async (req, res, next) => {
    const { id } = req.params;
    const { limit, offset } = req.query;
    try {
      const query = Forum.find(
        { category: id },
        {
          title: 1,
          slug: 1,
          author: 1,
          name: 1,
          publishedAt: 1,
        },
      )
        .populate('author', '_id username', 'User')
        .sort('publishedAt');

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
};
