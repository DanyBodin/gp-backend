const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  review_title: {
    unique: true,
    type: String,
  },
  review_text: {
    unique: true,
    type: String,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = Review;
