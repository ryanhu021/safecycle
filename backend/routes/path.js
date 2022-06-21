const express = require("express");
const fetch = require("node-fetch");
const ghBikeModel = require("../gh_bike_model.json");

const router = express.Router();

// POST - get path coordinates for safest path
router.post("/safest", async (req, res) => {
  const { startLat, startLon, endLat, endLon } = req.body;
  console.log("posting");

  fetch(`https://graphhopper.com/api/1/route?key=${process.env.GH_KEY}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile: "bike",
      points: [
        [startLon, startLat],
        [endLon, endLat],
      ],
      elevation: true,
      "ch.disable": true,
      custom_model: ghBikeModel,
    }),
  })
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: err });
    });
});

module.exports = router;
