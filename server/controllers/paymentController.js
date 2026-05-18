const razorpay = require("../config/razorpay");


// CREATE PAYMENT ORDER
const createPaymentOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
};