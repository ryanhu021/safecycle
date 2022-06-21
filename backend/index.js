// environmental vars
require("dotenv").config();

// imports
const express = require("express");
const pathRoutes = require("./routes/path");

// setup express
const app = express();
app.use(express.json());

// add routes
app.use("/path", pathRoutes);

// check graphhopper key
if (!process.env.GH_KEY) {
  console.error("No GraphHopper key found");
  process.exit(1);
}

// start server
app.listen(process.env.PORT || 3001);
