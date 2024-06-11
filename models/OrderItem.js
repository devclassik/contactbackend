const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, "Please add the quantity"],
    min: 1,
  },
  price: {
    type: Number,
    required: [true, "Please add the price"],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
