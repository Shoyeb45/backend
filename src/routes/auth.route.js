import Router from "express";
import { isLoggedIn } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/isLoggedIn").get(verifyJWT, isLoggedIn);

export default router;