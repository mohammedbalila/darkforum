const { Router } = require('express');
const passport = require('passport');
const {
  createThreaed,
  findAllThreads,
  findThread,
  deleteThread,
} = require('../controllers/thread');

const router = Router();

router
  .route('/')
  .get(findAllThreads)
  .post(passport.authenticate('jwt', { session: false }), createThreaed);

router
  .route('/:id')
  .get(findThread)
  .delete(passport.authenticate('jwt', { session: false }), deleteThread);

module.exports = router;
