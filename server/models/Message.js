import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    senderId:{tyoe:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    text:{type:String,},
    image:{type:String,},
    seen:{type:Boolean,deafult:false}
},{timestamp:true});

const Message=mongoose.model("Message",messageSchema);

export default Message;