const ErrorResponse = require('../utils/general/errorResponse');
const asyncHandler = require('../middleware/async');
const { userMessages } = require('../helpers/messages/messages');
const axios = require('axios');
const restaurantService = require('../services/restaurantService'); // Import the restaurantService module.


const {
  notFound,
  alreadyExists,
  serverError,
} = userMessages;

const Restaurant = require('../models/Restaurant');
const { standardResponse } = require('../utils/standardResponse');

//GET

// @route   GET api/v1/restaurants/get-all-restaurants
// @desc    Get all Restaurants
// @access  Public
exports.getAllRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await Restaurant.find();
  res.status(200).json({
    success: true,
    data: restaurants,
  });
});

//GET 

// @route   GET api/v1/restaurants/get-nearby-restaurants
// @desc    Get all nearby restaurants
// @access  Public
exports.getNearbyRestaurant = asyncHandler(async (req, res, next) => {

  const nearbyRestaurants = await restaurantService.findNearbyRestaurants();

  if (nearbyRestaurants.length === 0) {
    return next(new ErrorResponse('No nearby restaurants found', 404));
  }

  res.status(200).json({
    success: true,
    data: nearbyRestaurants,
  });
});