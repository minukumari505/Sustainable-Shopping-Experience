const mongoose=require('mongoose');
const AddressSchema=require('./AddressSchema');
const PaymentSchema=require('./PaymentSchema');
const EchoPurchase=require('./EchoPurchase');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        trim: true
    },
    lastName: {
        type: String,
        required: false ,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /.+\@.+\..+/       // basic email format check
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    addresses: {
        type: [AddressSchema],
        default: []
    },
    paymentMethods: {
        type: [PaymentSchema],
        default: []
    },
    ecoPurchaseHistory: {
        type: [EchoPurchase],
        default: []
    },
    badgeScore: {
        type: Number,
        default: 0
    },
    cart: [{                       // simple in-progress cart
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: false
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    orders: [{                     // reference to past orders
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    wishlist: [{                   // saved for later
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    roles: {                       // e.g. “customer”, “admin”
        type: [String],
        default: ["customer"]
    }
}, 
{
   timestamps: true               // adds createdAt & updatedAt
},
    
);

module.exports = mongoose.model("user", UserSchema);