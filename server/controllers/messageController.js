import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap}  from "../server.js"
// Get all users except the logged-in user, and count unseen messages
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        // Exclude current user and exclude password field
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // Count unseen messages from each user
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false,
            });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get messages between two users and mark them as seen
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        // Mark messages from selected user as seen
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId, seen: false },
            { $set: { seen: true } }
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to mark a message as seen using message ID
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });

        res.json({ success: true, message: "Message marked as seen" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


//send message to selected usr
export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
           const uploadResponse=await cloudinary.uploader.upload(image)
           imageUrl=uploadResponsesecure_url;
        }

        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        //emit the new message to the receiver socket
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.json({success:true,newMessage});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}