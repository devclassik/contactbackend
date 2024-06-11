const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  logoutTime: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Log', logSchema);
