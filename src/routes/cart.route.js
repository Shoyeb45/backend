import Router from "express";
import { addToCart } from "../controllers/cart.controller.js";

const router = Router();

router.route("/addToCart").get(addToCart);

export default router;