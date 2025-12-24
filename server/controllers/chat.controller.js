import Chat from "../models/chat.model.js";

//API for creating new chat 
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatData = {
            userId,
            userName: req.user.name,
            messages:[],
            name: req.user.name || "New Chat",
        }
        await Chat.create(chatData);
        res.status(201).json({
            success: true,
            message: 'Chat created successfully',
        });
    } 
    catch (error) {
        res.json({
            success: false,
            message: 'Error creating chat',
            error: error.message
        });
    }
};

//API for fetching all chats of a user
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({userId}).sort({updatedAt: -1});
        res.status(200).json({
            success:true,
            message:"Chats fetched successfully",
            chats
        }) 
    } 
    catch (error) {
        res.json({
            success: false,
            message: 'Error fetching chats',
            error: error.message
        });
    }
};

//API for deleting a chat
export const deletChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const{chatId} = req.body;

        await Chat.deleteOne({_id:chatId, userId});
        
        res.status(200).json({
            success:true,
            message:"Chats deleted successfully",
    
        }) 
    } 
    catch (error) {
        res.json({
            success: false,
            message: 'Error deleting chat',
            error: error.message
        });
    }
};