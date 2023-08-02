
const asyncHandler = require('../middleware/async');
const authService = require('../services/authService'); // Import the authService module.
const ErrorResponse = require('../utils/general/errorResponse');
const { standardResponse } = require('../utils/standardResponse');
const { authMessages } = require('../helpers/messages/messages');

const {
  loggedInSuccessfully,
} = authMessages;

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.registerUser({
      ...req.body,
      userName: req.body.userName.toLowerCase().trim(),
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return new ErrorResponse(error.message, 500).send(res);
  }
});

//@Desc   Login Users
//@route  GET /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return new ErrorResponse(error.message, 500).send(res);
  }
});

// @desc      Request password reset
// @route     POST /api/v1/auth/forgot-password
// @access    Public
exports.resetPasswordRequest = asyncHandler(async (req, res, next) => {
  try {
    const resetToken = await authService.requestPasswordReset(req.body.email);

    res.status(200).json({ success: true, data: { 'reset_token': resetToken } });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Confirm password reset
// @route     PUT /api/v1/auth/forgot-password/:reset_token
// @access    Public
exports.resetPasswordConfirm = asyncHandler(async (req, res, next) => {
  const { reset_token } = req.params;
  const newPassword = req.body.password;

  try {
    const user = await authService.confirmResetPassword(reset_token, newPassword);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }
});

// HELPERS 
const sendTokenResponse = (user, statusCode, res) => {
  try {
    const token = user.getSignedJwtToken();
    const options = {};
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
    user.password = undefined;
    user.perviousPasswords = undefined;
    user.loginIPs = undefined;
    user.perviousPasswords = undefined;

    standardResponse(res, loggedInSuccessfully, statusCode, {
      token,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};