const { Router } = require('express');
const passport = require('passport');
const {
  signup,
  login,
  findAll,
  findOne,
  findByUsername,
  confirm,
  updateOne,
} = require('../controllers/user');
const {
  isUnique,
  loginValidator,
  signupValidator,
  updateValidator,
} = require('../middleware/validator');

const router = Router();

router.get('/', findAll);
router.post('/signup', signupValidator, isUnique, signup);
router.post('/login', loginValidator, login);
router.get('/confirm/:hash', confirm);
router.get('/username/:username', findByUsername);

router
  .route('/:id')
  .get(findOne)
  .put(
    passport.authenticate('jwt', { session: false }),
    updateValidator,
    updateOne,
  );

module.exports = router;
