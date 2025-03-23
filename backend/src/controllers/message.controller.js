import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getSidebarUsers = async (req, res) => {
   try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {ne:loggedInUserId}}).select("-password");

    res.staus(200).json(filteredUsers);
   } catch (error) {
    console.log("Error in getSideBarUsers route", error);
    res.staus(500).json({error: "Internal server error"});
   }
}

export const getMessages = async (req, res) => {
    try {
        const {id:userToChat} = req.params;
        const myId = req.user._id;
        const Messages = await Message.find({
            $or:[{senderId:myId}, {receiverId:userToChat},
                {senderId:userToChat}, {receiverId:myId}
            ]
        })
        res.staus(200).json(Messages);
    } catch (error) {
        console.log("Error in getMessages route", error);
    res.staus(500).json({error: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    const {text, image} = req.body;
    const {id: receiverId} = req.params;
    if(image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    try {
        const senderId = req.user._id;
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl || null
        });

        await newMessage.save();

    //    use socket io here

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage route", error);
        res.status(500).json({ error: "Internal server error" });
    }
}