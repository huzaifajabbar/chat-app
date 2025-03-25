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
    messageHandler: null,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch {
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
        } catch {
            toast.error('Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (selectedUser) => {
        get().unsubscribeFromMessages();
        
        set({ 
            selectedUser, 
            messages: []
        });
    },

    sendMessages: async (data) => {
        const { selectedUser } = get();
        try {
          const res = await axiosInstance.post(`/messages/${selectedUser._id}`, data);
          set((state) => ({
            messages: [...state.messages, res.data]
          }));
          return res.data;
        } catch {
          toast.error('Failed to send message');
          return null;
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        const authUser = useAuthStore.getState().authUser;
        const { selectedUser } = get();
        
        if (!socket || !authUser || !selectedUser) return null;
    
        const messageHandler = (message) => {
            const isRelevantMessage = 
                (message.senderId === selectedUser._id && message.receiverId === authUser._id) ||
                (message.receiverId === selectedUser._id && message.senderId === authUser._id);
    
            if (isRelevantMessage) {
                set((state) => {
                    const messageExists = state.messages.some(
                        existingMsg => existingMsg._id === message._id
                    );
    
                    if (!messageExists) {
                        return { 
                            messages: [...state.messages, message].sort((a, b) => 
                                new Date(a.createdAt) - new Date(b.createdAt)
                            )
                        };
                    }
                    
                    return state;
                });
            }
        };
    
        socket.on('message', messageHandler);
        
        set({ messageHandler });
    
        return messageHandler;
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        const { messageHandler } = get();
        
        if (socket && messageHandler) {
            socket.off('message', messageHandler);
        }
        
        set({ messageHandler: null });
    }
}));