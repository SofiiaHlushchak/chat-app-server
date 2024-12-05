import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

export const configureSocketIO = (server) => {
    const io = new SocketIO(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN,
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("sendMessage", (newMessage) => {
            console.log("New message received on server:", newMessage);
            io.emit("newMessage", newMessage);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};
