import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.get("/", protectRoute, getAllUsers);
// todo: get messages

export default router;
