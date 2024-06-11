const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the product name"],
    unique: [true, "Product already exist"],
  },
  price: {
    type: Number,
    required: [true, "Please add the product price"],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  stock: {
    type: Number,
    required: [true, "Please add the product stock quantity"],
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);
