const express = require("express");
const router = express.Router();
const Order = require("../storageSchema/Order");
const Product = require('../storageSchema/ProductSchema');

// POST: Place a new order
router.post('/place-order', async (req, res) => {
    try {
      const orderData = req.body;
      console.log('📦 Received Order:', orderData); // ✅ log incoming order
      const newOrder = new Order(orderData);
      await newOrder.save();
      res.status(201).json({ message: 'Order saved successfully' });
    } catch (err) {
      console.error('❌ Order save error:', err);
      res.status(500).json({ error: 'Failed to place order' });
    }
  });

// GET: Fetch all orders for a user
router.get("/my-orders", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });
  
    try {
      const orders = await Order.find({ userEmail: email }).sort({ placedAt: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });


module.exports = router;