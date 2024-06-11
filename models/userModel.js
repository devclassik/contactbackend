const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add the username"],
  },
  email: {
    type: String,
    required: [true, "Please add the user email address"],
    unique: [true, "Email address already taken"],
  },
  password: {
    type: String,
    required: [true, "Please add the user password"],
    select: false,
  },
  role: {
    type: String,
    enum: ['customer', 'employee'],
    default: 'customer',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
