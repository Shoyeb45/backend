import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    }
}, {timestamps: true});


export const Category = mongoose.model("Category", categorySchema);

export const addCategory = async function(cate) {
    return (await Category.create({
        category: cate
    }));
};