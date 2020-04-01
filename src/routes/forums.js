const { Router } = require('express');
const passport = require('passport');
const {
  createForum,
  findAllForums,
  findForum,
  findForumBySlug,
  getThreads,
  deleteForum,
} = require('../controllers/forum');

const router = Router();

router
  .route('/')
  .get(findAllForums)
  .post(passport.authenticate('jwt', { session: false }), createForum);

router.get('/slug/:slug', findForumBySlug);

router
  .route('/:id')
  .get(findForum)
  .delete(passport.authenticate('jwt', { session: false }), deleteForum);

router.get('/:forumId/forums', getThreads);

module.exports = router;
