const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const axios = require("axios");
const Review = require("./models/Reviews");
const Collection = require("./models/Collection");

const mongoose = require("mongoose");

const isAuthentificated = require("./middlewares/isAuthentificated");

require("dotenv").config();

mongoose.connect(process.env.MONGO_ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(formidableMiddleware());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/games?key=${process.env.GP_APIKEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const userRoutes = require("./routes/user");

app.use(userRoutes);

//GAMES
app.get("/games", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/games?key=${
        process.env.GP_APIKEY
      }&search_excat=${true}&search=${req.query.name}&search_precise=${true}`
    );
    res.status(200).json(response.data.results[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//PUBLISHERS
app.get("/publishers", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/publishers?key=${process.env.GP_APIKEY}`
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//SERIES
app.get("/game/series", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/games/${req.query.game_id}/game-series?key=${process.env.GP_APIKEY}`
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DEVELOPERS
app.get("/developers", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/developers?key=${process.env.GP_APIKEY}`
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//REVIEWS
app.get("/game/reviews", async (req, res) => {
  try {
    const result = await Review.find({ game_id: req.query.game_id });
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//GENRES
app.get("/game/genres", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/genres?key=${process.env.GP_APIKEY}`
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//COLLECTION
app.get("/user/collection", async (req, res) => {
  try {
    const result = await Collection.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
/*
req.query.id
app.get("/signup", isAuthentificated, async (req, res) => {
  try {
  } catch (error) {}
});

app.get("/login", isAuthentificated, async (req, res) => {
  try {
  } catch (error) {}
});
*/

app.all("*", (req, res) => {
  res.json("All Routes");
});

app.listen(process.env.PORT, () => {
  console.log("server up and running");
});
