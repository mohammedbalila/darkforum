const { Router } = require('express');
const passport = require('passport');
const {
  createPost,
  findAllPosts,
  findPost,
  updatePost,
  deletePost,
} = require('../controllers/post');

const router = Router();

router
  .route('/')
  .get(findAllPosts)
  .post(passport.authenticate('jwt', { session: false }), createPost);

router
  .route('/:id')
  .get(findPost)
  .put(passport.authenticate('jwt', { session: false }), updatePost)
  .delete(passport.authenticate('jwt', { session: false }), deletePost);

module.exports = router;
