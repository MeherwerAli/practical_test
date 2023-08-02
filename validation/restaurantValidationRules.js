const { body, param } = require('express-validator');

const RestaurantValidationRules = {
  // Validate the request body when creating a new Restaurant entity
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 })
      .withMessage('Name cannot be longer than 255 characters'),
    body('address')
      .notEmpty()
      .withMessage('Address is required')
      .isLength({ max: 255 })
      .withMessage('Address cannot be longer than 255 characters'),
    body('cuisine')
      .notEmpty()
      .withMessage('Cuisine is required')
      .isLength({ max: 255 })
      .withMessage('Cuisine cannot be longer than 255 characters'),
    body('coordinates')
      .notEmpty()
      .withMessage('Coordinates are required')
      .isObject()
      .withMessage('Coordinates must be an object'),
    body('coordinates.latitude')
      .notEmpty()
      .withMessage('Latitude is required')
      .isNumeric()
      .withMessage('Latitude must be a number'),
    body('coordinates.longitude')
      .notEmpty()
      .withMessage('Longitude is required')
      .isNumeric()
      .withMessage('Longitude must be a number'),
  ],

  // Validate the request body when updating a Restaurant entity
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid restaurant ID')
      .notEmpty()
      .withMessage('ID is required'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 })
      .withMessage('Name cannot be longer than 255 characters'),
    body('address')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Address cannot be longer than 255 characters'),
    body('cuisine')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Cuisine cannot be longer than 255 characters'),
    body('coordinates')
      .optional()
      .isObject()
      .withMessage('Coordinates must be an object'),
    body('coordinates.latitude')
      .optional()
      .isNumeric()
      .withMessage('Latitude must be a number'),
    body('coordinates.longitude')
      .optional()
      .isNumeric()
      .withMessage('Longitude must be a number'),
  ],

  // Validate the request parameters when getting a Restaurant entity by ID
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid Restaurant ID')
      .notEmpty()
      .withMessage('ID is required'),
  ],
  getList: []
};

module.exports = RestaurantValidationRules;
