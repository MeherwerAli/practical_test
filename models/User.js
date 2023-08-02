const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const { usersMessages } = require('../helpers/messages/messages');
// const Role = require('./Role');
const Schema = mongoose.Schema;

const { emailNotFoundEn } = usersMessages;

const UserSchema = new Schema({
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, emailNotFoundEn],
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 255,
    select: false,
  },
  previousPasswords: {
    passwords: [
      {
        password: String,
        resetDate: Date,
      },
    ],
    select: false,
  },
  userName: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  logoutOfAllDevices: {
    type: Boolean,
    default: false,
  },
  isActivated: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}
  ,
  {
    timestamps: true,
  });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE ?? '30d',
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.plugin(uniqueValidator, {
  message: ` ( {PATH} ) ${usersMessages.uniqueValidatorEn} `,
});

module.exports = User = mongoose.model('users', UserSchema);
