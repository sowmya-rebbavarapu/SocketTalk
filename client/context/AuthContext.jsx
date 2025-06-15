import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Verify user session on app load
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user); // 👈 Connect socket after auth
      }
    } catch (error) {
      toast.error("Please log in again");
    }
  };

  // ✅ Login / Signup
  const login = async (route, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${route}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        connectSocket(data.userData); // 👈 Connect socket after login
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out");

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // ✅ Profile Update
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  // ✅ Socket Connection Logic
  const connectSocket = (userData) => {
    if (!userData) return;

    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      newSocket.emit("getOnlineUsers"); // 👈 Ask server for users
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("👥 Online users:", userIds);
      setOnlineUsers(userIds);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    setSocket(newSocket);
  };

  // ✅ Auto-login on page load
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token]);

  const value = {
    axios,
    token,
    setToken,
    authUser,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    setSocket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
