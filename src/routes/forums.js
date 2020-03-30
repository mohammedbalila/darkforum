const { Router } = require('express');
const passport = require('passport');
const {
  createForum,
  findAllForums,
  findForum,
  deleteForum,
} = require('../controllers/forum');

const router = Router();

router
  .route('/')
  .get(findAllForums)
  .post(passport.authenticate('jwt', { session: false }), createForum);

router
  .route('/:id')
  .get(findForum)
  .delete(passport.authenticate('jwt', { session: false }), deleteForum);

module.exports = router;
