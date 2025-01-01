import { ApiError } from "./../utils/ApiError.js";
import { User } from "./../models/users.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js"
import jwt from "jsonwebtoken";

/**
 * @author Shoyeb Ansari
 * Function to  verify token at current session
 */
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.error("No token provided");
            throw new ApiError(401, "Unauthorized request");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken._id).select("-password -refreshToken");

        if (!user) {
            console.error("User not found");
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});



