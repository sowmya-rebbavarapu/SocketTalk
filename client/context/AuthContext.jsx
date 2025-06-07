import { createContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

     const checkAuth=async()=>{
          try{
            const {data}=await axios.get("/api/auth/check");
            if(data.success)
            {
                setAuthUser(data.user)
            }
          }
          catch(error){
              toast.error(error.message)
          }
     }
    const value = {
        axios,
        token,
        setToken,
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
