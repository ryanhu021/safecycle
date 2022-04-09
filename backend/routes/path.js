const express = require("express");

const router = express.Router();

// GET - get path coordinates for safest path
router.get("/safest", (req, res) => {
  res.send("Hello");
});

module.exports = router;
