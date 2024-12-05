import { Chat } from "../models/Chat.js";
import { getRandomQuote } from "../services/quoteService.js";

export const sendMessage = async (req, res) => {
    const { chatId, text } = req.body;
    const io = req.io;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.messages.push({ text: text, sender: "USER" });

        await chat.save();

        res.status(200).json({ message: "Message sent" });

        setTimeout(async () => {
            try {
                const autoResponse = await getRandomQuote();

                chat.messages.push({ text: autoResponse, sender: "BOT" });

                await chat.save();

                io.emit("newMessage", {
                    chatId: chatId,
                    text: autoResponse,
                    sender: "BOT",
                });
            } catch (err) {
                console.error("Error generating bot response:", err);
            }
        }, 3000);
    } catch (err) {
        console.error("Error in sendMessage:", err);
        res.status(500).json({ message: "Error sending message", error: err });
    }
};
