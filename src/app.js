import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { cookieOptions } from "./constant.js";
const app = express();

// Configuring CORS
app.use(cors({
    origin: 'https://jewelix.netlify.app', // Frontend URL
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true // Allow cookies
}));

app.use(express.static('public'));

app.use(express.json({
    limit: "20kb"
}));


app.use(bodyParser.json());
// When recieving data through URL, url encodes data in different format, so while receiving it, we need to tell app, the it is url encoded
app.use(express.urlencoded({
    extended: true,
    limit: "20kb" 
}));

// For static pages and files - most of time, we'll use public folder to store the static files
app.use(cookieParser());

app.get("/", (req, res) => {
    
    res
    .cookie("test", "testCookie", cookieOptions)
    .send("Working fine");
});


app.get('/test-cookie', (req, res) => {
    res.cookie('testCookie', 'testValue', cookieOptions).send('Test cookie set!');
});


// ------------ Routes -----------------
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import authLogin from "./routes/auth.route.js";
import cartRouter from "./routes/cart.route.js";

// User api
app.use("/api/v1/user", userRouter);

// product admin api
app.use("/api/v1/product", productRouter);

// Authentication for login
app.use("/api/auth", authLogin);

// add to cart route
app.use("/api/v1/cart", cartRouter);
export default app;