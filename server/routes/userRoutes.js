const express = require("express");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// protected route
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;