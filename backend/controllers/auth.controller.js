import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

const authCookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production"
}

export const signUp=async (req,res)=>{
    try {
        const {userName,email,password}=req.body
        const checkUserName=await User.findOne({userName})
        if(checkUserName){
            return res.status(400).json({message:"username already exist"})
        }
          const checkUserEmail=await User.findOne({email})
        if(checkUserEmail){
            return res.status(400).json({message:"email already exist"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
     const user=await User.create({
        userName,email,password:hashedPassword
     }) 
     const token=await genToken(user._id)

      res.cookie("token",token,authCookieOptions)
     return res.status(201).json(user)


    } catch(error){
      return res.status(500).json({message:`signup error ${error}`})
    }

}
export const login=async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not exist"})
        }
         
      const isMatch=await bcrypt.compare(password,user.password)
      if(!isMatch){
        return res.status(400).json({message:"incorrect password"})
     }

     const token=await genToken(user._id)

      res.cookie("token",token,authCookieOptions)
     return res.status(200).json(user)


    } catch(error){
      return res.status(500).json({message:`login error ${error}`})
    }

}
export const logout=async (req,res)=>{
    try{
        res.clearCookie("token")
    return res.status(200).json({message:"log out"})
    }
    catch (error){
        return res.status(500).json({message:"log out error"})
    }
}
