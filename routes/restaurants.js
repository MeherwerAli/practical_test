const express = require('express');
const router = express.Router();

const {
  getAllRestaurants, getNearbyRestaurant,
} = require('../controllers/restaurants');


// Import middleware
const { protect } = require('../middleware/auth');

router.use(protect);


router
  .route('/get-all-restaurants')
  .get(
    protect,
    getAllRestaurants
  )
router.route('/get-nearby-restaurants')
  .get(
    protect,
    getNearbyRestaurant
  )

module.exports = router;
