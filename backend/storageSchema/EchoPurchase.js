const mongoose = require("mongoose");


// assume AddressSchema & PaymentMethodSchema are defined/imported above…

// ─── Sub-schema to track each eco-friendly purchase ───────────────────────────
const EcoPurchase = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    purchasedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

// module.exports = mongoose.model("EcoPurchaseSchema", EcoPurchaseSchema);
module.exports = EcoPurchase;