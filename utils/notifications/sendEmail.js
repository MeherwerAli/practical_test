const nodemailer = require('nodemailer');
const { authMessages } = require('../../helpers/messages/messages');
const asyncHandler = require('../../middleware/async');
const Email = require('../../models/Email');
const ErrorResponse = require('../../utils/general/errorResponse');

const { otpCreationProblemEn } = authMessages;

// const sendEmail = asyncHandler(async (options, next) => {
//   // create reusable transporter object using the default SMTP transport
//   const transporter = nodemailer.createTransport({
//     service: process.env.SMTP_SERVICE,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//     debug: true,
//     logger: true,
//   });
//
//   //Create email instance
//   const { email, subject, type } = options;
//   const emailInstance = new Email({
//     to: email,
//     from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//     subject: subject,
//     message: options.html ? options.html : options.message,
//     type,
//   });
//
//   try {
//     // send mail with defined transport object
//     const message = {
//       from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//       to: email,
//       subject: subject,
//       text: options.message ? options.message : undefined,
//       html: options.html ? options.html : undefined,
//     };
//     const info = await transporter.sendMail(message);
//     console.log('Message sent: %s', info.messageId);
//     emailInstance.isSent = true;
//     await emailInstance.save();
//   } catch (error) {
//     //Save email instance
//     emailInstance.isSent = false;
//     await emailInstance.save();
//     console.log(error);
//     return next(new ErrorResponse(otpCreationProblemEn, 400));
//   }
// });

const sendEmail = async options => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define the email options
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
