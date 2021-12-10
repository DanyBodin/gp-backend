const mongoose = require("mongoose");

const Collection = mongoose.model("Collection", {
  game_name: {
    unique: true,
    type: String,
  },
  game_id: {
    unique: true,
    type: Number,
  },
  background_image: Object,
  token: String,
  hash: String,
  salt: String,
});

module.exports = Collection;
