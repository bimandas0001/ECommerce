import mongoose from 'mongoose';

// Product schema
export const Product = mongoose.model("Product", {
    id: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    available: {
        type: Boolean,
        default: true
    }    
})

// User schema
export const User = mongoose.model("User", {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Object,
        default: {}
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

// Session schema
export const Session = mongoose.model("session", new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    {collection: "session"}
)) 