import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { editProfile, getCurrentUser, getotherUsers } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.js"

const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/others",isAuth,getotherUsers)
userRouter.put("/profile",isAuth,upload.single("image"),editProfile)


export default userRouter 