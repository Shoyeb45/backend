import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);