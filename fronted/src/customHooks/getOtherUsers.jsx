import { useEffect } from "react"
import axios from "axios"
import { serverUrl } from '../main';
import { useDispatch } from "react-redux"
import { setOtherUsers, setUserData } from '../redux/userSlice';

const useOtherUser = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) {
            dispatch(setOtherUsers([]));
            return;
        }

        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/others`, { withCredentials: true });
                dispatch(setOtherUsers(result.data));
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 404) {
                    dispatch(setUserData(null));
                    dispatch(setOtherUsers([]));
                    return;
                }
                console.error("Failed to fetch other users:", error.response?.data || error.message);
            }
        };

        fetchUser();
    }, [dispatch, userId]);
};

export default useOtherUser