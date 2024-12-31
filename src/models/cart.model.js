import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    }
}, {timestamps: true});

export const Cart = mongoose.model("Cart", cartSchema);