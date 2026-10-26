import { createSlice } from "@reduxjs/toolkit";

const messageSlice=createSlice({
    name:"message",
    initialState:{
        messages:[]
    },
    reducers:{
        setMessage:(state,action)=>{
            state.messages=action.payload
        },
        appendMessage:(state,action)=>{
            if (!state.messages.some((message) => message._id === action.payload._id)) {
                state.messages.push(action.payload)
            }
        },
        mergeMessages:(state,action)=>{
            const messagesById = new Map(action.payload.map((message) => [message._id, message]))
            for (const message of state.messages) {
                if (!messagesById.has(message._id)) {
                    messagesById.set(message._id, message)
                }
            }
            state.messages = Array.from(messagesById.values())
        }
         
    }
})
export const {setMessage,appendMessage,mergeMessages}= messageSlice.actions
export default  messageSlice.reducer