import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  imageMsgController,
  textMsgController,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/text", authMiddleware, textMsgController);
messageRouter.post("/image", authMiddleware, imageMsgController);

export default messageRouter;
