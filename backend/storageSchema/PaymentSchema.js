const mongoose=require('mongoose')
const AddressSchema = require('./AddressSchema');
// Sub-schema for stored payment methods
const PaymentSchema = new mongoose.Schema({
    cardType: {                     // e.g. “Visa”, “MasterCard”
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    last4: {                        // last 4 digits only
        type: String,
        required: true,
        match: /^\d{4}$/
    },
    expiryMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    expiryYear: {
        type: Number,
        required: true,
        min: 2025       // or whatever makes sense
    },
    billingAddress: AddressSchema,  // could reuse the AddressSchema
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// module.exports = mongoose.model("PaymentMethodSchema", PaymentMethodSchema);
module.exports = PaymentSchema;