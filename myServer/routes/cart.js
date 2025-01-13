const express = require("express");
const router = express.Router();
const Cart = require('../models/cart');
const server = express();
const Product = require('../models/product');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

server.use(express.json()); 

const { isAuthenticated } = require('../middleware/auth'); 

router.post('/add', isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; 
  console.log('Request Body:', req.body); 
  console.log('User ID:', userId);
  console.log('Product ID:', productId); 
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const product = await Product.findOne({ id: Number(productId) }); 
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product found:', product); 

    const cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total = cart.items[itemIndex].quantity * product.price;
      } else {
        cart.items.push({
          productId: product._id, 
          name: product.title,
          price: product.price,
          quantity,
          total: quantity * product.price
        });
      }

      cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
      await cart.save();
    } else {

      const newCart = new Cart({
        userId,
        items: [{
          productId: product._id, 
          name: product.title,
          price: product.price,
          quantity,
          total: quantity * product.price
        }],
        totalPrice: quantity * product.price
      });
      await newCart.save();
    }

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    console.error('Error in /cart/add:', error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



  router.get('/', isAuthenticated, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId'); 
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

router.delete('/remove/:productId', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('Cart before removal:', cart); // Log the cart state before removal

    // Check if productId is a valid ObjectId
    let objectIdProductId;
    if (ObjectId.isValid(productId)) {
      objectIdProductId = new ObjectId(productId);
    } else {
      // Assuming productId is an integer, convert it properly.
      const product = await Product.findOne({ id: Number(productId) });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      objectIdProductId = product._id; // Use the product's ObjectId
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(item => item.productId.toString() !== objectIdProductId.toString());

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);

    // Save the updated cart
    await cart.save();

    console.log('Cart after removal:', cart); // Log the cart state after removal

    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/update', isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const product = await Product.findOne({ id: Number(productId) }); 
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

      cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
      await cart.save();

      return res.status(200).json({ message: 'Item updated successfully' });
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.post('/save', isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const cartData = req.body;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: cartData.items, totalPrice: cartData.totalPrice } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Cart state saved successfully', cart });
  } catch (error) {
    console.error('Error saving cart state:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


  module.exports = router;
  