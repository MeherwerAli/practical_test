const { body, param } = require('express-validator');

const UserValidationRules = {
  // Validate the request body when creating a new User entity
  create: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is not valid'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6, max: 255 })
      .withMessage('Password must be between 6 and 255 characters'),
    body('isActivated').optional().isBoolean().withMessage('Is activated must be a boolean'),
    body('isSuspended').optional().isBoolean().withMessage('Is suspended must be a boolean'),
    body('isDeleted').optional().isBoolean().withMessage('Is deleted must be a boolean'),
  ],

  // Validate the request body when updating a User entity
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
      .notEmpty()
      .withMessage('ID is required'),
    body('email')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is not valid'),
    body('password')
      .optional()
      .isLength({ min: 6, max: 255 })
      .withMessage('Password must be between 6 and 255 characters'),
    body('isActivated').optional().isBoolean().withMessage('Is activated must be a boolean'),
    body('isSuspended').optional().isBoolean().withMessage('Is suspended must be a boolean'),
    body('isDeleted').optional().isBoolean().withMessage('Is deleted must be a boolean'),
  ],

  // Validate the request parameters when getting a User entity by ID
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid User ID')
      .notEmpty()
      .withMessage('ID is required'),
  ],
  getList: []
};

module.exports = UserValidationRules;
