const express = require('express');
const {
  register,
  login,
  resetPasswordRequest,
  resetPasswordConfirm,
  logout,
} = require('../controllers/auth');

const router = express.Router();
const { validateLogin } = require('../validation/auth/auth');
const UserValidationRules = require("../validation/userValidationRules");
const validateSchema = require("../validation/validateSchema");

router
  .route('/register')
  .post(
    UserValidationRules.create,
    validateSchema(UserValidationRules.create),
    register
  );

router.post('/login', validateLogin, login);

router.post('/forgot-password', resetPasswordRequest);
router.put('/forgot-password/:reset_token', resetPasswordConfirm);

module.exports = router;
