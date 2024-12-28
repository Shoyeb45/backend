import Router from "express";
import { isLoggedIn } from "../controllers/user.controller.js";

const router = Router();

router.route("/isLoggedIn").get(isLoggedIn);

export default router;