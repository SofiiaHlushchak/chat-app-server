import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, required: true },
});

const ChatSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  messages: [MessageSchema],
});

export const Chat = mongoose.model("Chat", ChatSchema);
