import express from "express";
import { createChat, deletChat, getChats } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.get("/create", authMiddleware, createChat);

chatRouter.get('/fetch', authMiddleware, getChats);

chatRouter.post('/delete', authMiddleware, deletChat);

export default chatRouter;
