import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage=async (req,res)=>{
    try {
        let sender=req.userId
        let {receiver}=req.params
        let {message}=req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation =await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        })
        let newMessage=await Conversation.create({
            sender,receiver,message,image
        })
        if(!conversation){
            conversation=await Conversation.create({
                particpants:[sender,receiver],
                message:[newMessage._id]
            })
        }else{
                conversation.message.push(newMessage._id)
               await conversation.save()
            }
            return res.status(201).json(newMessage)
        }
     catch (error) {
       return res.status(500).json({message:`send message ${error}`})
    }
}
export const getMessage=async (req,res)=>{
 try {
       let sender=req.userId
        let {receiver}=req.params

     let conversation =await Conversation.findOne({
            participants:{$all:[sender,receiver]} 
        }).populate("message")
         if(!conversation){
            conversation=await Conversation.create({
                particpants:[sender,receiver],
                message:[newMessage._id]
            })
        }
        return res.status(200).json(conversation?.message)
         
 } catch (error) {
    return res.status(500).json({message:`get message ${error}`})
 }
}