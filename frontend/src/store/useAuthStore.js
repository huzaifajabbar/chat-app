import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data, isCheckingAuth: false });
            get().connectSocket();
        } catch {
            set({ authUser: null, isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data.user });
            get().connectSocket();
            window.location.reload();
            toast.success(res.data.message || "Successfully signed up!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully");
            return true;
        } catch {
            toast.error("Logout failed");
            return false;
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            window.location.reload();
            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed!");
            return false;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.put("/auth/update", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            return false;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        
        if (socket?.connected || !authUser?._id) return null;
        
        if (socket) {
          socket.disconnect();
        }
        
        const SOCKET_URL = import.meta.env.MODE === "development" 
            ? "http://localhost:3000" 
            : "/";
        
        const newSocket = io(SOCKET_URL, {
          query: { userId: authUser._id },
          withCredentials: true,
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
        
        newSocket.on("connect", () => {
          set({ 
            socket: newSocket, 
            onlineUsers: [authUser._id]
          });
        });
      
        newSocket.on("getOnlineUsers", (userIds) => {
          if (Array.isArray(userIds)) {
            set({ onlineUsers: userIds });
          }
        });
      
        newSocket.on("disconnect", () => {
          set({ socket: null, onlineUsers: [] });
        });
      
        return newSocket;
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (!socket) return;
    
        socket.disconnect();
        set({ socket: null, onlineUsers: [] });
    },
}));