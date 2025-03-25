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
        // Cleanup previous subscriptions
        get().unsubscribeFromMessages();
        
        set({ 
            selectedUser, 
            messages: [] // Reset messages when changing user
        });
    },

    sendMessages: async (data) => {
        const { selectedUser } = get();
        try {
          const res = await axiosInstance.post(`/messages/${selectedUser._id}`, data);
          // Update the local messages state immediately
          set((state) => ({
            messages: [...state.messages, res.data]
          }));
          return res.data;
        } catch (error) {
          toast.error('Failed to send message');
          return null;
        }
      },
      

    subscribeToMessages: () => {
        // Dynamically get current socket and auth state
        const getSocket = () => useAuthStore.getState().socket;
        const getAuthUser = () => useAuthStore.getState().authUser;
        
        const socket = getSocket();
        const authUser = getAuthUser();
        const { selectedUser } = get();
        
        // Validate all required components
        if (!socket) {
            console.warn('Cannot subscribe to messages: Socket is not available');
            return null;
        }

        if (!authUser) {
            console.warn('Cannot subscribe to messages: No authenticated user');
            return null;
        }

        if (!selectedUser) {
            console.warn('Cannot subscribe to messages: No selected user');
            return null;
        }
    
        const messageHandler = (message) => {
            // Verify message is for current conversation
            const isRelevantMessage = 
                (message.senderId === selectedUser._id && message.receiverId === authUser._id) ||
                (message.receiverId === selectedUser._id && message.senderId === authUser._id);
    
            if (isRelevantMessage) {
                set((state) => {
                    // Prevent duplicate messages
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
    
        // Attach the message handler
        socket.on('message', messageHandler);
        
        // Store the handler for cleanup
        set({ messageHandler });
    
        return messageHandler;
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