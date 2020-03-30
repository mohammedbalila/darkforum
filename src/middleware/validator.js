const { check } = require('express-validator/check');
const { User } = require('../models');

const isUnique = async (req, res, next) => {
  const { email } = req.body;
  const notUniqueEmail = await User.findOne({ email });

  if (notUniqueEmail) {
    return res.status(400).json({ errors: [{ email: 'This email was used' }] });
  }
  return next();
};

const loginValidator = [
  check('username', 'username must be included'),
  check('password', 'password must be included').isLength({
    min: 8,
  }),
];

const signupValidator = [
  check('username', 'username must be included'),
  check('password', 'password must be included').isLength({
    min: 8,
  }),
  check('email', 'Please enter a valid email').isEmail(),
  check('firstName', 'First name must be provided').isLength({ min: 2 }),
  check('lastName', 'Last name must be provided').isLength({ min: 2 }),
];

const updateValidator = [
  check('email', 'Please enter a valid email')
    .optional()
    .isEmail(),
  check('firstName', 'First name must be provided')
    .optional()
    .isLength({ min: 2 }),
  check('lastName', 'Last name must be provided')
    .optional()
    .isLength({ min: 2 }),
];

module.exports = {
  loginValidator,
  signupValidator,
  updateValidator,
  isUnique,
};
