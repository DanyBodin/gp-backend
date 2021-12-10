const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User.js");
const Review = require("../models/Reviews.js");
const Collection = require("../models/Collection.js");

const router = express.Router();

router.post("/user/addcollection", async (req, res) => {
  try {
    const isGameExist = await Collection.findOne({
      game_id: req.fields.game_id,
    });

    if (isGameExist !== null) {
      res.status(400).json({ message: "Game is already in collection" });
    } else {
      const newCollection = new Collection({
        game_name: req.fields.game_name,
        game_id: req.fields.game_id,
        background_image: req.fields.background_image,
      });

      await newCollection.save();
      res.json({ message: "Game saved in your collection" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/signup", async (req, res) => {
  try {
    if (req.fields.username === undefined) {
      res.status(400).json({ message: "missing parameter(s)" });
    } else {
      const isUserExist = await User.findOne({ email: req.fields.email });

      if (isUserExist !== null) {
        res
          .status(400)
          .json({ message: "account with this email already exists" });
      } else {
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(64);

        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();
        res.json({
          id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user === null) {
      res.status(400).json({ message: "Unauthorized" });
    } else {
      console.log(user.hash, "Hash à comparer");
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );

      if (user.hash === newHash) {
        res.json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/review", async (req, res) => {
  try {
    if (req.fields.review_text) {
      if (req.fields.review_title) {
        const newReview = new Review({
          review_title: req.fields.review_title,
          review_text: req.fields.review_text,
          game_id: req.fields.game_id,
        });

        await newReview.save();
        res.json("Thank you for reviewing!");
      } else {
        res.json({ message: "Missing review title" });
      }
    } else {
      res.json({ message: "Missing review content" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
