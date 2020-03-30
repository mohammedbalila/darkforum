const { Router } = require('express');
// const passport = require("passport");
const {
  findAllCategories,
  createCategory,
  findCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

const router = Router();

router
  .route('/')
  .get(findAllCategories)
  .post(createCategory);

router
  .route('/:id')
  .get(findCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
