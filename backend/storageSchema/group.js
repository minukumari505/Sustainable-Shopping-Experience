const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  link: String,
  deadline: String,
  cartItems: Array,
  members: [String],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  locationName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Ensure a 2dsphere index is created
GroupSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Group', GroupSchema);