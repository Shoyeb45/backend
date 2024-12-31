import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        index: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        index: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

export const CartItem = mongoose.model("CartItem", cartItemSchema);