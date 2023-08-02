const ErrorResponse = require('../utils/general/errorResponse');
const asyncHandler = require('../middleware/async');
const { userMessages } = require('../helpers/messages/messages');
const axios = require('axios');
const Restaurant = require('../models/Restaurant');


// Function to find nearby restaurants based on the user's geolocation
async function findNearbyRestaurants() {
    // Fetch latitude and longitude
    let ip = await axios.get('https://api.ipify.org');
    let geo = await axios.get(`http://ip-api.com/json/${ip.data}`);
    const longitude = parseFloat(geo.data.lon);
    const latitude = parseFloat(geo.data.lat);
  
    console.log(longitude, latitude);
  
    // Call the findNearbyRestaurants function from the restaurantService
    const maxDistance = 50; // Adjust the distance threshold as needed (50 kilometers in this example).
    const restaurants = await Restaurant.find({}).lean();
    const nearbyRestaurants = restaurants.filter(restaurant => {
      const distance = calculateDistance(latitude, longitude, restaurant.location.coordinates[1], restaurant.location.coordinates[0]);
      return distance <= maxDistance;
    });
    return nearbyRestaurants;
  }
  
  module.exports = {
    calculateDistance,
    findNearbyRestaurants,
  };


// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const radius = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;
    return distance;
  }
  
  module.exports = {
    calculateDistance,
  };