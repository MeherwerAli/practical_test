const AWS = require('aws-sdk');
const ErrorResponse = require('../../utils/general/errorResponse');
const asyncHandler = require('../../middleware/async');
const Email = require('../../models/Email');
const { generalMessages } = require('../../helpers/messages/messages');

const { emailContentEmpty, emailCouldNotBeSent } = generalMessages;
const { AWS_REGION, AWS_API_VERSION, AWS_ACCESS_KEY_ID } = process.env;

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
});

const ses = new AWS.SES({ apiVersion: AWS_API_VERSION });

module.exports = sendEmailViaAws = asyncHandler(
  async (
    recipients,
    template,
    subject,
    sender,
    type,
    message,
    byPassEmail,
    next
  ) => {
    const params = {
      Destination: {
        ToAddresses: recipients,
      },
      Source: sender,
    };

    if (template) {
      params.Message.Body = {
        Html: {
          Charset: 'UTF-8',
          Data: template,
        },
      };
    } else if (message) {
      params.Message.Body = {
        Text: {
          Charset: 'UTF-8',
          Data: message,
        },
      };
    } else {
      return next(new ErrorResponse(emailContentEmpty, 400));
    }

    try {
      const emailInstance = new Email({
        to: JSON.stringify(recipients),
        from: sender,
        subject: subject,
        message: message,
        type,
      });
      ses.sendEmail(params, async (err, data) => {
        if (err) {
          console.log(err, err.stack);
          //Save email instance
          emailInstance.isSent = false;
          await emailInstance.save();
          console.log(error);
          if (!next && !byPassEmail)
            return next(new ErrorResponse(emailCouldNotBeSent, 400));
          else next();
        } else {
          emailInstance.isSent = true;
          await emailInstance.save();
          next && next();
        }
      });
    } catch (error) {}
  }
);
