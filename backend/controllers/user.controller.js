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
export const getotherUsers=async (req,res)=>{
    try {
     let users= await User.find({
        _id:{$ne:req.userId}
     }).select("-password")
     return res.status(200).json(users)
        
    } catch (error) {
        return res.status(500).json({message:`get other user error ${error}`})
    }
}

export const search = async (req,res)=>{
    try {
        const { query } = req.query;
        if (typeof query !== "string" || !query.trim()) {
            return res.status(200).json([]);
        }

        const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const users = await User.find({
            _id: { $ne: req.userId },
            $or: [
                { name: { $regex: escapedQuery, $options: "i" } },
                { userName: { $regex: escapedQuery, $options: "i" } },
            ],
        })
            .select("-password")
            .limit(20);

        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({message:` search user error ${error}`})
    }
}