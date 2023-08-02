const Validator = require('validator');
const { authMessages } = require('../../helpers/messages/messages');
const User = require('../../models/User');
const ErrorResponse = require('../../utils/general/errorResponse');
const isEmpty = require('../isEmpty');
const {
  credentialProblemEn,
} = authMessages;

module.exports.validateLogin = (req, res, next) => {
  const data = req.body;
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  if (Validator.isEmpty(data.email)) {
    errors.email = `${credentialProblemEn}`;
  }
  if (
    !Validator.whitelist(data.email, /^[\w\d-.]+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/)
  ) {
    errors.email = `${credentialProblemEn}`;
  }
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = `${credentialProblemEn}`;
  }
  if (!isEmpty(errors)) {
    for (let key in errors) {
      if (errors[key]) return new ErrorResponse(errors[key], 400).send(res);
    }
  }
  next();
};
