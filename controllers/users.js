const ErrorResponse = require('../utils/general/errorResponse');
const asyncHandler = require('../middleware/async');
const { userMessages } = require('../helpers/messages/messages');
const crypto = require('crypto');

const {
  notFound,
} = userMessages;

// Importing Validation middleware
// const validateUserInput = require('../validation/user/user');

//Import Models
const User = require('../models/User');
const { standardResponse } = require('../utils/standardResponse');

//GET 

// @route   GET api/v1/users
// @desc    Get all users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(notFound, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
