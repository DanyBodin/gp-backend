const mongoose = require("mongoose");

const Collection = mongoose.model("Collection", {
  game_name: {
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

module.exports = Collection;
