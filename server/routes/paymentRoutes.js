const express = require("express");

const {
  createPaymentOrder,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// protected route
router.post("/create-order", protect, createPaymentOrder);

module.exports = router;