const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    isActivated: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create a geospatial index on the location field
RestaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('restaurants', RestaurantSchema);
module.exports = Restaurant;
