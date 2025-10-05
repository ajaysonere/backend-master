import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { getUsers, updateUser } from '../controllers/ProfileController.js';

const profileRouter = express.Router();

profileRouter.get("/get-user", authMiddleware , getUsers)
profileRouter.put("/update-user-profile/:id", authMiddleware, updateUser)

export default profileRouter;