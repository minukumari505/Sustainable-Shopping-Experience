const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: String,
  description: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  // productId:{type:String,required:false}
  userEmail: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  ecoPackaging: Boolean,
  deliveryDate: String,
  address: String,
  placedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);