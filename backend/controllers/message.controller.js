import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;
        const { message } = req.body;

        let image = "";
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const newMessage = await Message.create({
            sender,
            receiver,
            message: message || "",
            image,
        });

        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                message: [newMessage._id]
            });
        } else {
            conversation.message.push(newMessage._id);
            await conversation.save();
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        return res.status(500).json({ message: `send message ${error}` });
    }
};

export const getMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        }).populate("message");

        if (!conversation) {
            return res.status(200).json([]);
        }

        return res.status(200).json(conversation.message);
    } catch (error) {
        return res.status(500).json({ message: `get message ${error}` });
    }
};