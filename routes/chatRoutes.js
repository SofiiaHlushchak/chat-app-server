import express from "express";
import {
    createChat,
    getChats,
    getChatById,
    updateChat,
    deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createChat);

router.get("/", getChats);

router.get("/:chatId", getChatById);

router.put("/:chatId", updateChat);

router.delete("/:chatId", deleteChat);

export default router;
