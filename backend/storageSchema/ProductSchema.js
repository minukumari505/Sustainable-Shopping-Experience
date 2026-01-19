// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // explicit numeric ID alongside Mongo’s _id
    productId: {
        type: String,
        required: true,
        unique: true
    },

    // Basic listing info
    productName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,    // "$12.49"
        required: true,
        trim: true
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C'],
        default: 'A'
    },

    // Inline filters object
    filters: {
        plasticFree: { type: Boolean, default: false },
        fscCertified: { type: Boolean, default: false },
        carbonNeutral: { type: Boolean, default: false },
        recycledMaterials: { type: Boolean, default: false }
    },

    // URL or path to the seller’s image
    productImage: {
        type: String,
        required: true,
        trim: true
    },

    // Manufacturing details
    manufacturingProcess: {
        type: String, trim: true
    },
    transportationMethod: {
        type: String, trim: true
    },
    materialsUsed: {
        type: String, trim: true
    },

    // Eco Specifications (10 model inputs)
    plasticReducedPercent: {
        type: Number, required: true, min: 0, max: 100
    },
    chemicalUsedPercent: {
        type: Number, required: true, min: 0, max: 100
    },
    co2ReducedPercent: {
        type: Number, required: true, min: 0, max: 100
    },
    isRecyclable: {
        type: Boolean, required: true
    },
    packagingRecyclable: {
        type: Boolean, required: true
    },
    biodegradablePercent: {
        type: Number, required: true, min: 0, max: 100
    },
    waterUsedLiters: {
        type: Number, required: true, min: 0
    },
    energyUsedKwh: {
        type: Number, required: true, min: 0
    },
    productWeightKg: {
        type: Number, required: true, min: 0
    },
    productLifespanYears: {
        type: Number, required: true, min: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
