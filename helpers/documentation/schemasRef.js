// Define the paths you want to update the $ref values
module.exports.refPath = {
  RestaurantSchema: [
  ],
  UserSchema: [
    ['/api/v1/auth/register', 'post', 'application/json'],
    ['/api/v1/auth/login', 'post', 'application/json'],
    ['/api/v1/auth/forgot-password', 'post', 'application/json'],
  ],
};
