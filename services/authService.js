const User = require('../models/User');
const ErrorResponse = require('../utils/general/errorResponse');
const sendEmail = require('../utils/notifications/sendEmail');
const crypto = require('crypto');
const { authMessages } = require('../helpers/messages/messages');

const {
  userNotFoundEn,
  wrongPasswordOrEmailEn,
  notFound,
  loggedInSuccessfully,
  alreadyExists,
} = authMessages;

// Function to handle user registration
async function registerUser(userData) {
  try {
    // Check if the user already exists
    const userCheck = await User.find({
      userName: userData.userName.toLowerCase().trim(),
    });
    if (userCheck.length > 0) {
      throw new ErrorResponse(alreadyExists, 404);
    }

    const user = await User.create({
      ...userData,
      userName: userData.userName.toLowerCase().trim(),
    });

    return user;
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
}

// Function to handle user login
async function loginUser(email, password) {
  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase().replace(/\s/g, ''),
    }).select({ password: 1, loginIPs: 1, email: 1 });

    if (!user) {
      throw new ErrorResponse(userNotFoundEn, 404);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ErrorResponse(wrongPasswordOrEmailEn, 401);
    }
    return user;
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
}

// Function to request password reset
async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse(notFound, 404);
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `YOUR_RESET_URL/${resetToken}`; // Replace "YOUR_RESET_URL" with your actual reset URL.

  const message = `Reset pwd API: \n\n ${resetUrl}`;

  // Code to send the reset password email (commented out for this example)
  // await sendEmail({
  //   email: user.email,
  //   subject: 'Password reset token',
  //   message
  // });

  return resetToken;
}

// Function to confirm password reset
async function confirmResetPassword(resetToken, newPassword) {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse(notFound, 404);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return user;
}

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  confirmResetPassword,
};