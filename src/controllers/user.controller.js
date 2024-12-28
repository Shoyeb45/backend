import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


/**
 * 
 * @author Shoyeb Ansari
 * @param {*} user : databse object of userSchema
 * @returns Access token and Refresh Token
 */
const generateRefreshAndAccessToken = async (userId) => {
    try {
        // Generate tokens
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        // Update refresh tokens
        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wronog while generating access and refresh token");
    }
};

/**
 * Function for registering user
 */
const registerUser = asyncHandler( async (req, res) => {
    // console.log(req);

    console.log(req.body);
    const {userName, email, password, fullName, contactNumber} = req.body;
      
    const existedUser = await User.findOne({
        $or: [{ userName: userName.toLowerCase() }, { email }]
    })


    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist");
    }

    // Upload data in schema
    const user = await User.create({
        fullName,
        email,
        password,
        userName: userName.toLowerCase(),
        contactNumber
    });

    // Check if the user is really selected
    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken" // give the column name which we need to exclude by -Column1 -column2 ....
    );

    // If something went wrong, it's our mistake so, error code should be from server side 
    if (!isUserCreated) {
        throw new ApiError("500", "Something went wrong from our side while registering, please try once more.");
    }

    // Send response using our ApiResponse class
    return res.status(201).json(new ApiResponse(200, isUserCreated, "User registered succefully"));  
});


/**
 * Function for making user login
 * 
 * @author Shoyeb Ansari
 */
const loginUser = asyncHandler ( async (req, res) => {
    // 1. get the data
    
    const { userName, password } = req.body;
    
    if (!userName) {
        throw new ApiError(400, "Username is required.");
    }

    const user = await User.findOne({userName});

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect");
    }

    // Update tokens
    const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true      
    };
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
});


/**
 * Function to log out the user.
 * 
*/
const logoutUser = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(  // this method will find and update the databse
        req.user._id,
        {
            $set: { // set is operator which allows us to set the field
                refreshToken: undefined
            }
        },
        {
            new: true   // return value will be update 
        }
    );
    
    const options = {
        httpOnly: true,
        secure: true      
    };
    
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});


/**
 * Function for refreshing access tokens
 */
const refreshAccessToken = asyncHandler (async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken; // another one is for mobile app

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised access");
    }

    try {
        // Get decoded token of refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        
        // Get user object
        const user = await User.findById(decodedToken?._id);

        // Throw error if it does not exist
        if (!user) {
            throw new ApiError(401, "Inalid refresh token");
        }
        
        // Check both the tokens
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        
        const option = {
            httpOnly: true,
            secure: true
        };
        
        // Get new refresh and access tokens
        const {newRefreshToken, accessToken} = await generateRefreshAndAccessToken(user._id);

        // res.redirect("/");
        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .redirect("/")
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

});

const isLoggedIn = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ isLoggedIn: false, message: "User is not logged in" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({ isLoggedIn: true, userId: decoded._id });
    } catch (error) {
        return res.status(401).json({ isLoggedIn: false, message: "User is not logged in", error: error.message });
    }
});

// export functions
export { 
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    isLoggedIn
}; 