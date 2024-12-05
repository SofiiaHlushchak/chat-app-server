import axios from "axios";
import { Chat } from "../models/Chat.js";

export const createChat = async (req, res) => {
    const { firstName, lastName } = req.body;

    try {
        const newChat = new Chat({ firstName, lastName });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: "Error creating chat." });
    }
};

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats." });
    }
};

export const getChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found." });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat." });
    }
};

export const updateChat = async (req, res) => {
    const { chatId } = req.params;
    const { firstName, lastName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { firstName, lastName },
            { new: true }
        );
        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: "Error updating chat." });
    }
};

export const deleteChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        await Chat.findByIdAndDelete(chatId);
        res.status(200).json({ message: "Chat deleted." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chat." });
    }
};

export const createPredefinedChats = async () => {
    try {
        const predefinedChats = [
            { firstName: "Alice", lastName: "Freeman" },
            { firstName: "Jozefina", lastName: "Freeman" },
            { firstName: "Piter", lastName: "Freeman" },
        ];

        for (const chat of predefinedChats) {
            const existingChat = await Chat.findOne({
                firstName: chat.firstName,
                lastName: chat.lastName,
            });
            if (!existingChat) {
                const newChat = new Chat(chat);
                await newChat.save();
                console.log(`Chat "${chat.firstName}" created!`);
            }
        }
    } catch (error) {
        console.error("Error creating previous chats:", error);
    }
};

export const sendMessage = async (req, res) => {
    const { chatId, sender, text } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        const message = { sender, text };
        chat.messages.push(message);
        await chat.save();

        setTimeout(async () => {
            try {
                const response = await axios.get(
                    "https://api.adviceslip.com/advice"
                );
                const autoResponse = response.data.content;

                const botMessage = {
                    sender: "Bot",
                    text: autoResponse,
                };

                chat.messages.push(botMessage);
                await chat.save();
            } catch (err) {
                console.error("Error retrieving the quote:", err);
            }
        }, 3000);

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: "Error sending the message.",
        });
    }
};
