const { Router } = require('express');
// const passport = require("passport");
const {
  findAllCategories,
  createCategory,
  findCategory,
  findCategoryBySlug,
  updateCategory,
  getForums,
  deleteCategory,
} = require('../controllers/category');

const router = Router();

router
  .route('/')
  .get(findAllCategories)
  .post(createCategory);

router.get('/slug/:slug', findCategoryBySlug);

router
  .route('/:id')
  .get(findCategory)
  .put(updateCategory)
  .delete(deleteCategory);

router.get('/:categoryId/forums', getForums);

module.exports = router;
