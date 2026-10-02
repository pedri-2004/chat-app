import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser= async (req,res)=>{
    try{
        let userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        } 
       return res.status(200).json({user})
    }
    catch(error){
     return res.status(500).json({message:`current user error ${error}`})
    }
}

export const editProfile=async (req,res)=>{
    try {
        let {name}=req.body
        const updates={name}
        if(req.file){
            updates.image=await uploadOnCloudinary(req.file.path)
        }
        let user=await User.findByIdAndUpdate(req.userId,updates,{new:true}).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`current profile error ${error}`})
    }
}