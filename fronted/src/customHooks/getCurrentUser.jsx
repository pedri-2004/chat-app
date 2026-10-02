import { useEffect } from "react"
import axios from "axios"
import { serverUrl } from '../main';
import {useDispatch} from "react-redux"
import { setUserData } from '../redux/userSlice';

const useCurrentUser=()=>{
    let dispatch=useDispatch()
    useEffect(()=>{
        const fetchUser=async ()=>{
            try {
                let result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                dispatch(setUserData(result.data.user))
            }
            catch (error){
                if (error.response?.status === 401 || error.response?.status === 404) {
                    dispatch(setUserData(null))
                    return
                }
                console.error("Failed to restore current user:", error.response?.data || error.message)
            }
        }
        fetchUser()
    },[dispatch])
}
export default useCurrentUser