import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

export const CartItem = mongoose.model("CartItem", cartItemSchema);