import { useEffect } from "react"
import axios from "axios"
import { serverUrl } from '../main';
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from '../redux/userSlice';
import { mergeMessages, setMessage } from "../redux/messageSlice";

const getMessage = () => {
    const dispatch = useDispatch();
    const { userData, selectedUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (!selectedUser?._id) return;

        const controller = new AbortController();
        dispatch(setMessage([]));

        const fetchMessaage = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
                    withCredentials: true,
                    signal: controller.signal,
                });
                dispatch(mergeMessages(result.data || []));
            } catch (error) {
                if (controller.signal.aborted) return;
                if (error.response?.status === 401 || error.response?.status === 404) {
                    dispatch(setUserData(null));
                    dispatch(setMessage([]));
                    return;
                }
                console.error("Failed to fetch messages:", error.response?.data || error.message);
            }
        };

        fetchMessaage();
        return () => controller.abort();
    }, [selectedUser, userData, dispatch]);
};

export default getMessage;