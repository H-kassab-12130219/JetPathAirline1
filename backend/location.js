const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Return unique destinations from flights table
router.get("/get-all-locations", (req, res) => {
  const q = "SELECT DISTINCT arrival FROM flights";

  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;
