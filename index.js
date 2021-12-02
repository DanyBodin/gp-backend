const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const axios = require("axios");
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
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

app.get("/name", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.GP_URI}/games?key=${process.env.GP_APIKEY}&search_excat=true&search=${req.query.name}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/*
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
