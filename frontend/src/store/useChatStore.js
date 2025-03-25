import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({  
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (selectedUser) => {
        // Ensure any previous message subscription is cleaned up
        get().unsubscribeFromMessages();
        
        set({ 
            selectedUser, 
            messages: [] // Reset messages when changing user
        });
    },

    sendMessages: async(data) => {
        const { selectedUser } = get();
        try {
         const res = await axiosInstance.post(`/messages/${selectedUser._id}`, data);
         return res.data;
        } catch (error) {
         toast.error('Failed to send message');
         return null;
        }
     },

     subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        const { selectedUser } = get();
        
        if (!socket || !selectedUser) return;
    
        const messageHandler = (message) => {
            // Ensure message is for the current conversation
            const currentUserId = useAuthStore.getState().authUser?._id;
            if (
                (message.senderId === selectedUser._id && message.receiverId === currentUserId) ||
                (message.receiverId === selectedUser._id && message.senderId === currentUserId)
            ) {
                // Use a functional update with deduplication
                set((state) => {
                    // Check if message already exists to prevent duplicates
                    const messageExists = state.messages.some(
                        existingMsg => existingMsg._id === message._id
                    );
    
                    if (!messageExists) {
                        return { 
                            messages: [...state.messages, message] 
                        };
                    }
                    
                    return state; // Return current state if message already exists
                });
            }
        };
    
        socket.on('message', messageHandler);
        
        // Store the messageHandler for clean removal later
        set({ messageHandler });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        const { messageHandler } = get();
        
        if (socket && messageHandler) {
            socket.off('message', messageHandler);
        }
        
        // Reset the messageHandler
        set({ messageHandler: null });
    }
}));