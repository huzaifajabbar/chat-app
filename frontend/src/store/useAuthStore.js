import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set)=> ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")

            set({authUser: res.data})
        } catch (error) {
            console.log("Error in check auth", error)
            set({authUser: null})
        }
        finally {
            set({isCheckingAuth: false})
        }
    },

    signUp: async(data) => {
       try {
        set({isSigningUp: true});
        const res = await axiosInstance.post("/auth/signup", data);
        set({authUser: res.data.user});
        // toast.success(res.data.message);
       } catch (error) {
        toast.error(error.response.data.message);
       }
       finally {
        set({isSigningUp: false});
       }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }, 

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data }); // <-- Direct access to res.data
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed!";
            toast.error(message);
            throw new Error(message);
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
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    }

}))