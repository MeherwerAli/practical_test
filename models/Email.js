const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema(
  [
    {
      to: String,
      from: String,
      subject: String,
      message: String,
      isSent: Boolean,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      type: {
        type: String,
        enum: [
          'otp',
          'reset-password',
          'general-notifications',
          'security-alert',
          'jobs-announcements',
        ],
        index: true,
      },
      isDeleted: { type: Boolean, default: false },
    },
  ],
  {
    timestamps: true,
  }
);

// Index on agency field
EmailSchema.index({ user: 1 });

module.exports = Email = mongoose.model('emails', EmailSchema);
