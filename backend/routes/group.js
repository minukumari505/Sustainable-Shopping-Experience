const express = require('express');
const router = express.Router();
const Group = require('../storageSchema/group');
const authMiddleware = require('../middlewares/auth');

// 📌 Create a group with coordinates + optional location name
router.post('/create', async (req, res) => {
  try {
    const {
      name,
      link,
      deadline,
      cartItems,
      members,
      latitude,
      longitude,
      locationName // optional address string
    } = req.body;

    const group = new Group({
      name,
      link,
      deadline,
      cartItems,
      members,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude] // [lng, lat]
      },
      locationName // new field
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Join a group
router.post('/join/:id', async (req, res) => {
  const { user } = req.body;
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.members.includes(user)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    group.members.push(user);
    await group.save();
    res.status(200).json({ message: 'Joined group successfully', group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Leave a group
router.post('/leave/:id', async (req, res) => {
  const { user } = req.body;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: user } },
      { new: true }
    );

    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📍 Get groups within radius of a given location
router.get('/nearby', authMiddleware, async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const distanceKm = parseFloat(radius) || 5; // Default to 5 km

  try {
    const groups = await Group.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], distanceKm / 6371] // Earth radius in km
        }
      }
    });

    res.json(groups);
  } catch (err) {
    console.error("Error in /group/nearby:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🧑‍🤝‍🧑 Get all groups a user is part of
router.get('/my-groups', authMiddleware, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const groups = await Group.find({ members: userEmail }).sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📃 Get all groups (dev use)
router.get('/all', async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    console.error("Error in /group/all:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Get a specific group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;