const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
} = require('../controllers/users');

// Import User Model
const User = require('../models/User');

// Import middleware
const advancedResults = require('../middleware/advancedSearch');
const { protect } = require('../middleware/auth');
const UserValidationRules = require('../validation/userValidationRules');
const validateSchema = require('../validation/validateSchema');

router
  .route('/:id')
  .get(validateSchema(UserValidationRules.getById), getUser);

router
  .route('/')
  .get(
    protect,
    UserValidationRules.getList,
    validateSchema(UserValidationRules.getList),
    advancedResults(User),
    getUsers
  )


module.exports = router;
