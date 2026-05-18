const Order = require("../models/Order");
const Cart = require("../models/Cart");


// CREATE ORDER
const createOrder = async (req, res) => {
  try {

    const {
      shippingAddress,
      totalPrice,
    } = req.body;

    // get user cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // create order
    const order = await Order.create({
      user: req.user._id,

      orderItems: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),

      shippingAddress,
      totalPrice,
    });

    // clear cart after order
    cart.items = [];

    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user._id,
    }).populate("orderItems.product");

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADMIN GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email");

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus =
      req.body.orderStatus || order.orderStatus;

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};