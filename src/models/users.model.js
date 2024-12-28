import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs"; 


// Model for user
const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: true,
        unique: false,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    address: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    contactNumber: {
        type: String,
        trim: true,
        required: true,
    }
}, {timestamps: true});


// Encrypting the password 
userSchema.pre("save", async function(next) {
    // First check if password field is modified or not
    if (!this.isModified("password")) {
        return next();
    }

    // hash method will take password and encrypt it by using some algorithm.
    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

// Method for checking the password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcryptjs.compare(password, this.password);
}


// Method for generating access token
userSchema.methods.generateAccessToken = function() {
    // We'll use sign method which takes three arguments
    return jwt.sign(
        {
            _id: this._id, // id from database  
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        // Secret code which it will use to generate
        process.env.ACCESS_TOKEN_SECRET,
        // Give expiry in object form
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Function for generating refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id, // id from database  
        },
        // Secret code which it will use to generate
        process.env.REFRESH_TOKEN_SECRET,
        // Give expiry in object form
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

};


export const User = mongoose.model("User", userSchema);