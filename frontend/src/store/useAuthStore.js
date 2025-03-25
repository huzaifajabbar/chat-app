import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = "http://localhost:3000"

export const useAuthStore = create((set, get)=> ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")

            set({authUser: res.data, isCheckingAuth: false})
            get().connectSocket();
        } catch (error) {
            console.log("Error in check auth", error)
            set({authUser: null, isCheckingAuth: false})
        }
    },

    signUp: async(data) => {
       try {
        set({isSigningUp: true});
        const res = await axiosInstance.post("/auth/signup", data);
        set({
            authUser: res.data.user, 
            isSigningUp: false
        });
        get().connectSocket();
        toast.success(res.data.message || "Successfully signed up!");
        return true;
       } catch (error) {
        const errorMessage = error.response?.data?.message || "Signup failed";
        toast.error(errorMessage);
        return false;
       } finally {
        set({isSigningUp: false});
       }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            get().disconnectSocket();
            toast.success("Logged out successfully");
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Logout failed";
            toast.error(errorMessage);
            return false;
        }
    }, 

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ 
                authUser: res.data, 
                isLoggingIn: false 
            }); 
            get().connectSocket();
            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed!";
            toast.error(message);
            set({ isLoggingIn: false });
            return false;
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.put("/auth/update", data);
            set({ 
                authUser: res.data, 
                isUpdatingProfile: false 
            });
            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update profile";
            toast.error(errorMessage);
            set({ isUpdatingProfile: false });
            return false;
        }
    }, 

    connectSocket: () => {
        const { authUser, socket } = get();
        
        // Disconnect any existing socket before creating a new one
        if (socket) {
            socket.disconnect();
        }

        if (!authUser?._id) return null; 
    
        const newSocket = io(BASE_URL, {
            query: { userId: authUser._id },
            withCredentials: true,
            transports: ["websocket", "polling"],
        });
    
        // Handle connection and events
        newSocket.on("connect", () => {
            console.log("✅ Connected:", newSocket.id);
            set({ socket: newSocket });
        });
    
        newSocket.on("getOnlineUsers", (userIds) => {
            if (Array.isArray(userIds)) { 
                set({ onlineUsers: userIds });
                console.log("🟢 Online Users:", userIds);
            }
        });
    
        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected from WebSocket");
            set({ socket: null, onlineUsers: [] });
        });

        return newSocket;
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (!socket) return;
    
        socket.disconnect();
        console.log("❌ WebSocket Disconnected:", socket.id);
        set({ socket: null, onlineUsers: [] });
    },
}));