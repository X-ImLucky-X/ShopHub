const Cart = require("../models/Cart");


// ADD TO CART
const addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // create cart if not exists
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // check if product already exists
    const itemIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId
    );

    if (itemIndex > -1) {

      // increase quantity
      cart.items[itemIndex].quantity += quantity;

    } else {

      // add new item
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET USER CART
const getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      item =>
        item.product.toString() !== req.params.productId
    );

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};