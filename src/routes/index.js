const { Router } = require('express');
const users = require('./users');
const categories = require('./categories');
const forums = require('./forums');
const threads = require('./threads');
const posts = require('./posts');

const router = Router();
router.use('/users', users);
router.use('/categories', categories);
router.use('/forums', forums);
router.use('/threads', threads);
router.use('/posts', posts);

module.exports = router;
