const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL FLIGHTS
router.get("/get-all-flights", (req, res) => {
  const q = "SELECT * FROM flights";

  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;
