module.exports.createOTP = () => {
  let otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  return otp;
};

module.exports.compareOTP = (otpCreationDate) => {
  const today = new Date();
  return parseInt((today - otpCreationDate) / (1000 * 60 * 60 * 24));
};
