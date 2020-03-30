const { Schema, model } = require('mongoose');
const { compareSync, hashSync } = require('bcryptjs');

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },

    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },

    registeredAt: {
      type: Date,
      default: Date.now(),
    },

    lastVisitAt: {
      type: Date,
      default: Date.now(),
    },
  },
);

// Virtual for user's full name
UserSchema.virtual('fullName')
  // eslint-disable-next-line func-names
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

/* eslint-disable */
UserSchema.methods.setPassword = function(password) {
  try {
    const user = this;
    const hash = hashSync(password, 8, this.password);
    user.password = hash;
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function(password) {
  try {
    return compareSync(password, this.password);
  } catch (error) {
    throw new Error(error.message);
  }
};

/* eslint-disable */
UserSchema.methods.setHash = function(hash) {
  try {
    const user = this;
    user.hash = hash;
    return hash;
  } catch (error) {
    throw new Error(error.message);
  }
};

UserSchema.index({ username: 1 });

module.exports = model('user', UserSchema);
