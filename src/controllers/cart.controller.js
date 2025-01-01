import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js"
import { ApiError } from "../utils/ApiError.js";
import { CartItem } from "../models/cartItem.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


/**
 * Helper function to create item in cart
 * @param {*} cartId      id of cart
 * @param {*} productId   id of product that should be added in cartItem
 * @param {*} quantity    how many products we need add
 * @returns 
 */
const createCartItem = async (cartId, productId, quantity) => {
    return await CartItem.create({
        cart: cartId,
        product: productId,
        quantity: Number(quantity),
    });
};


/**
 * Function to add product in cart
 * @author  Shoyeb Ansari
 */
const addToCart = asyncHandler( async (req, res) => {
    try {
        const { quantity, productId } = req.body;

        // Validate input
        if (!quantity || !productId) {
            throw new ApiError(400, "Quantity and product are required")
        }

        // Validate quantity
        if (Number(quantity) <= 0) {
            throw new ApiError(400, "Quantity must be a positive number");
        }

        // Get the user id 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // Verify token
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeToken._id);

        // verify user
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        // Find cartId using user id
        const cart = await Cart.findOne({ user: user._id });

        // If cart is there, then just update the item
        if (cart) {
            // Find row in the cartItem which have the product
            let cartItem = await CartItem.findOne({
                cart: cart._id,
                product: productId
            });

            // Means there is cartItem, and we just need to update the quantity by quantity
            if (cartItem) {
                await CartItem.updateOne(
                    { _id: cartItem._id },
                    {
                        $inc: { quantity: Number(quantity) }
                    }
                );
                cartItem = await CartItem.findById(cartItem._id);
                return res
                    .status(201)
                    .json(new ApiResponse(201, cartItem, "Quantity update succefully in the cart item"));
            }
           
            // Create one and add in the cartItem
            cartItem = await createCartItem(cart._id, productId, quantity);
            
            return res
                .status(201)
                .json(new ApiResponse(201, cartItem, "New cart item added successfully"));
        }

        // Create cart for user
        const newCart = await Cart.create({ user: user._id });
        // Create cart item for the cart
        const newCartItem = await createCartItem(newCart._id, productId, quantity);

        // Add product in cartItem
        return res
            .status(201)
            .json(new ApiResponse(201, newCartItem, "Product added succefully in cart item and new cart created for user"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Item couldn't be added in cart")
    }
});

export {
    addToCart
};