const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    img: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: [true, "Please add title"],
      unique: [true, "Title already exist"],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("Blog", blogSchema);
