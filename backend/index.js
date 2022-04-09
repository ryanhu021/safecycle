// environmental vars
require("dotenv").config();

// imports
const express = require("express");
const mongoose = require("mongoose");
const pathRoutes = require("./routes/path");

// setup express
const app = express();
app.use(express.json());

// add routes
app.use("/path", pathRoutes);

// connect to mongodb
if (!process.env.CONNECTION_URL) {
  console.warn("Missing CONNECTION_URL environment variable");
}
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(`Unable to conenct to MongoDB:\n${error}`));

// start server
app.listen(process.env.PORT || 3001);
