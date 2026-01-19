const express = require('express');
const router = express.Router();
const Order = require('../storageSchema/Order');
const Product = require('../storageSchema/ProductSchema');
const User = require('../storageSchema/user');
const Group = require('../storageSchema/group');

router.get('/user-dashboard', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Fetch all orders for this user
    const orders = await Order.find({ userEmail: email });
    const totalOrders = orders.length;

    // Count how many groups this user belongs to
    const groupCount = await Group.countDocuments({ members: email });

    // If no orders, still return empty stats but include totalGroups
    if (!totalOrders) {
      return res.json({
        plasticReductionList: [],
        ecoTrend: [],
        categoryStats: [],
        totalCo2Saved: 0,
        totalOrders: 0,
        totalProductsOrdered: 0,
        badgeScore: 0,
        totalGroups: groupCount,
      });
    }

    // Aggregate through orders to compute stats
    let co2Saved = 0;
    let totalProductsOrdered = 0;
    let ecoScoreSum = 0;
    let ecoScoreCount = 0;

    const monthlyMap = new Map();
    const categoryMap = {};
    const plasticList = [];

    for (const order of orders) {
      const orderMonth = new Date(order.placedAt)
        .toLocaleString('default', { month: 'short' });

      for (const item of order.items) {
        totalProductsOrdered += item.quantity;

        const product = await Product.findOne({ productId: item.productId });
        if (!product) {
          console.warn('Product not found for ID:', item.productId);
          continue;
        }

        // Compute CO₂ saved
        co2Saved += (product.co2ReducedPercent / 100) * item.quantity;

        // Monthly eco trend
        monthlyMap.set(
          orderMonth,
          (monthlyMap.get(orderMonth) || 0) + item.quantity
        );

        // Category stats
        const cat = product.category;
        if (!categoryMap[cat]) categoryMap[cat] = { count: 0, total: 0 };
        categoryMap[cat].count += 1;
        categoryMap[cat].total += product.plasticReducedPercent;

        // Plastic reduction list — include productId now
        plasticList.push({
          productId: product.productId,
          name: product.productName,
          percentage: product.plasticReducedPercent,
        });

        // Composite eco score
        const plasticScore = product.plasticReducedPercent / 100;
        const chemicalScore = (100 - (product.chemicalUsedPercent || 0)) / 100;
        const co2Score = product.co2ReducedPercent / 100;
        const bioScore = (product.biodegradablePercent || 0) / 100;
        const recyclableMap = {
          'Fully recyclable': 1,
          'Partially recyclable': 0.5,
          'Not recyclable': 0
        };
        const recyclableScore =
          recyclableMap[product.recyclabilityLevel] || 0;

        const ecoScore =
          0.25 * plasticScore +
          0.25 * co2Score +
          0.15 * chemicalScore +
          0.15 * recyclableScore +
          0.2 * bioScore;

        ecoScoreSum += ecoScore;
        ecoScoreCount += 1;
      }
    }

    // Build the final arrays and metrics
    const ecoTrend = [...monthlyMap.entries()].map(
      ([month, value]) => ({ month, value })
    );
    const categoryStats = Object.entries(categoryMap).map(
      ([label, { count, total }]) => ({
        label,
        pct: Math.round(total / count),
      })
    );
    const plasticReductionList = plasticList.slice(0, 10);
    const totalCo2Saved = parseFloat(co2Saved.toFixed(1));
    const badgeScore = ecoScoreCount
      ? parseFloat((ecoScoreSum / ecoScoreCount).toFixed(2))
      : 0;

    // Persist the badgeScore back to the user document
    await User.findOneAndUpdate({ email }, { badgeScore });

    console.log('Dashboard response:', {
      plasticReductionList,
      ecoTrend,
      categoryStats,
      totalCo2Saved,
      totalOrders,
      totalProductsOrdered,
      badgeScore,
      totalGroups: groupCount,
    });

    // Send the enriched response
    res.json({
      plasticReductionList,
      ecoTrend,
      categoryStats,
      totalCo2Saved,
      totalOrders,
      totalProductsOrdered,
      badgeScore,
      totalGroups: groupCount,
    });
  }catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/top-badge-scores', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'email',
          foreignField: 'userEmail',
          as: 'orders'
        }
      },
      { $unwind: { path: '$orders', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$orders.items', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          let: { prodId: { $toString: '$orders.items.productId' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: '$productId' }, '$$prodId'] }
              }
            }
          ],
          as: 'productInfo'
        }
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          itemCo2Saved: {
            $cond: {
              if: { $and: ['$orders.items.quantity', '$productInfo.co2ReducedPercent'] },
              then: {
                $multiply: [
                  '$orders.items.quantity',
                  { $divide: ['$productInfo.co2ReducedPercent', 100] }
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: '$email',
          badgeScore: { $first: '$badgeScore' },
          totalCo2Saved: { $sum: '$itemCo2Saved' }
        }
      },
      { $sort: { badgeScore: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          email: '$_id',
          badgeScore: 1,
          totalCo2Saved: { $round: ['$totalCo2Saved', 1] }
        }
      }
    ]);
    res.json(users);
  } catch (err) {
    console.error('Error fetching top badge scores:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;