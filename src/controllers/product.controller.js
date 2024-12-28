import { Product } from "../models/products.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/categories.model.js";
import mongoose  from "mongoose";


export const sendData = asyncHandler( async (req, res) => {
    try {
        const products = await Product.find();
    } catch (error) {
        res.status(500).json({ message : "Server Error", error });
    }
});

export const addProduct = asyncHandler(async (req, res) => {
    try {
        console.log("here");

        const { productName, category, price, quantity, typeOfMaterial, description } = req.body;

        // Process uploaded files
        const filePaths = req.files.map((file) => file.path); // Local file paths
        const originalNames = req.files.map((file) => file.originalname); // Original file names

        // Upload files to Cloudinary and maintain original names
        const productImageUrls = await Promise.all(
            filePaths.map((filePath, index) =>
                uploadOnCloudinary(filePath, originalNames[index]) // Pass the file path and original name
            )
        );

        // Extract the URLs from the Cloudinary responses
        const imageUrls = productImageUrls.map((image) => image.url);

        console.log(imageUrls);

        // Save the product details in the database
        const product = await Product.create({
            productName,
            category,
            price,
            productImage: imageUrls,
            quantity,
            typeOfMaterial,
            description,
        });

        res.status(201).json(new ApiResponse(201, "Product uploaded successfully"));
    } catch (error) {
        console.error(error);
        throw new ApiError(501, "Could not add the product into product catalogue");
    }
});


export const getProductOfMaterial = asyncHandler ( async (req, res) => {
    const material = req.query.typeOfMaterial;
    console.log(material);
    
    if (!material) {
        return res.status(400).send({ error: 'Material is required' });
    }

    try {
        console.log(material);
        
        const products = await Product.find({ typeOfMaterial: material });
        console.log(products);
        
        res.status(201).json(products);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send({ error: 'Server error' });
    }
});


export const getProductOfCategory = asyncHandler ( async (req, res) => {
    const category = req.query.category;
    console.log("category function");
    
    
    if (!category) {
        return res.status(400).send({ error: 'Category is required' });
    }

    try {
        const products = await Product.find({ category: category });
        console.log(products);
        
        res.status(201).json(products);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send({ error: 'Server error' });
    }
});



export const getIndividualProductData = asyncHandler (async (req, res) => {
    const productId = req.params.id;

    const newObjectId = new mongoose.Types.ObjectId(productId);
    console.log(newObjectId);
    
    try {
        const product = await Product.findOne({_id:newObjectId}); 
        console.log(product);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);  
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}) 