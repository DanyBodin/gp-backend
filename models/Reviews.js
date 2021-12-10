const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  review_title: String,
  review_text: String,
  game_id: {
    unique: true,
    type: Number,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = Review;
