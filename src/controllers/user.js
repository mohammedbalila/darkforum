/* eslint-disable consistent-return */
const passport = require('passport');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');
const _ = require('lodash');
const { User } = require('../models');
const { redisGet, redisSet } = require('../config/cache');
const { confirm: confirmEmail } = require('../config/mail');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  signup: async (req, res, next) => {
    try {
      const fields = _.pick(req.body, [
        'email',
        'password',
        'username',
        'firstName',
        'lastName',
      ]);
      const validatorErrors = validationResult(req);
      if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors
          .array()
          .map((error) => ({ [error.param]: error.msg }));
        return res.status(400).json({ errors });
      }
      const user = new User(fields);
      const hash = uuid();
      user.setPassword(fields.password);
      user.setHash(hash);
      await user.save();
      await confirmEmail(fields.email, hash);
      const payload = {
        _id: user.id,
        username: user.username,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY);
      return res.json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          ...payload,
        },
        token,
      });
    } catch (error) {
      return next(error);
    }
  },

  login: async (req, res, next) => {
    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
      const errors = validatorErrors
        .array()
        .map((error) => ({ [error.param]: error.msg }));
      return res.status(400).json({ errors });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ info });
      }

      const payload = {
        _id: user.id,
        username: user.username,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY);
      return res.json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          ...payload,
        },
        token,
      });
    })(req, res, next);
  },

  confirm: async (req, res, next) => {
    try {
      const { hash } = req.params;
      const user = await User.findOne({ hash });
      if (!user) {
        return res.status(403).json('invalid link');
      }
      if (hash !== user.hash) {
        return res.status(401).send('invalid link');
      }
      user.isConfirmed = true;
      user.hash = '';
      await user.save();

      return res.json('email has been activated successfully');
    } catch (error) {
      return next(error);
    }
  },

  findAll: async (req, res, next) => {
    const { limit = '10', offset = '0' } = req.query;
    const key = `users_${limit}_${offset}`;
    try {
      const cacheValue = await redisGet(key);

      if (cacheValue) {
        const users = JSON.parse(cacheValue);
        return res.json({ users });
      }

      const users = await User.find(
        {},
        { fullName: 1, username: 1, lastVisitAt: 1 },
      )
        .limit(+limit)
        .skip(+offset);

      redisSet(key, 18000, JSON.stringify(users));
      return res.json({ users });
    } catch (error) {
      return next(error);
    }
  },

  findOne: async (req, res, next) => {
    const { id: _id } = req.params;
    try {
      const user = await User.findOne({ _id }, { password: 0, hash: 0 });
      if (!user) {
        return res.status(404).json({ message: 'User was not found' });
      }
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  },

  findByUsername: async (req, res, next) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username }, { password: 0, hash: 0 });
      if (!user) {
        return res.status(404).json({ message: 'User was not found' });
      }
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  },

  updateOne: async (req, res, next) => {
    const fields = _.pick(req.body, ['firstName', 'lastName', 'email']);
    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
      const errors = validatorErrors
        .array()
        .map((error) => ({ [error.param]: error.msg }));
      return res.status(400).json({ errors });
    }
    const { id: _id } = req.user;
    try {
      await User.updateOne({ _id }, fields, {
        runValidators: true,
      });
      return res.json({ message: 'updated successfully' });
    } catch (error) {
      return next(error);
    }
  },
};
