import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; // Ensure correct Cloudinary setup
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getSidebarUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
 
        // Ensure the ID is converted properly
        const filteredUsers = await User.find({ _id: { $ne: new mongoose.Types.ObjectId(loggedInUserId) } })
            .select("-password");
 
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getSidebarUsers route", error);
        res.status(500).json({ error: "Internal server error" });
    }
 };
export const getMessages = async (req, res) => {
   try {
      const { id: userToChat } = req.params;
      const myId = req.user._id;
      const messages = await Message.find({
         $or: [
            { senderId: myId, receiverId: userToChat },
            { senderId: userToChat, receiverId: myId }
         ]
      });

      res.status(200).json(messages); // ✅ Fixed typo
   } catch (error) {
      console.log("Error in getMessages route", error);
      res.status(500).json({ error: "Internal server error" });
   }
};

export const sendMessage = async (req, res) => {
   const { text, image } = req.body;
   const { id: receiverId } = req.params;
   let imageUrl = null; // ✅ Declare imageUrl to avoid undefined error

   if (image) {
      try {
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageUrl = uploadResponse.secure_url;
      } catch (error) {
         console.log("Error uploading image to Cloudinary", error);
         return res.status(500).json({ error: "Image upload failed" });
      }
   }

   try {
      const senderId = req.user._id;
      const newMessage = new Message({
         senderId,
         receiverId,
         text,
         image: imageUrl
      });

      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(receiverId);

      if(receiverSocketId) {
         io.to(receiverSocketId).emit("message", newMessage);
      }

      res.status(201).json(newMessage);
   } catch (error) {
      console.log("Error in sendMessage route", error);
      res.status(500).json({ error: "Internal server error" });
   }
};
