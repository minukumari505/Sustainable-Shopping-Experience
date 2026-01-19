// storageSchema/AddressSchema.js
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
}, {
    _id: false
});

// <<< EXPORT THE SCHEMA, NOT A MODEL >>> 
module.exports = AddressSchema;
