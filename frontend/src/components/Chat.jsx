import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import MessagesSkeleton from './MessagesSkeleton.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import ImageWithSkeleton from './ImageWithSkeleton.jsx';

const Chat = () => {
  const { 
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedUser, 
    subscribeToMessages, 
    unsubscribeFromMessages 
  } = useChatStore();
  const { authUser, isCheckingAuth } = useAuthStore();
  const messagesContainerRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isCheckingAuth) {
      setIsInitializing(false);
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    // Ensure both selectedUser and authUser are present
    if (selectedUser?._id && authUser?._id) {
      // Fetch messages first
      const initializeChat = async () => {
        try {
          // Fetch messages for the selected user
          await getMessages(selectedUser._id);
          
          // Subscribe to real-time messages
          const handler = subscribeToMessages();
          
          // Optional: Log if subscription fails
          if (!handler) {
            console.warn('Failed to subscribe to messages');
          }
        } catch (error) {
          console.error('Chat initialization error:', error);
        }
      };
  
      initializeChat();
  
      // Cleanup subscription when component unmounts or user changes
      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [selectedUser?._id, authUser?._id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isInitializing || isCheckingAuth) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Please log in to start chatting</p>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      
      {/* Messages container */}
      <div 
        className="flex-1 p-4 overflow-y-auto" 
        id="messages-container"
        ref={messagesContainerRef}
      >
        {!selectedUser ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => {
              const isSentByAuthUser = message.senderId === authUser?._id;
              const previousMessage = index > 0 ? messages[index - 1] : null;
              
              // Check if this message is from the same sender as the previous message
              const isSameSender = previousMessage && previousMessage.senderId === message.senderId;
              
              // Check time difference (5 minutes = 300000 milliseconds)
              const isQuickSuccession = previousMessage && 
                (new Date(message.createdAt) - new Date(previousMessage.createdAt)) < 300000;

              // Determine appropriate border radius
              const getBorderRadius = () => {
                if (!isSameSender || !isQuickSuccession) return 'rounded-lg';
                
                // First message in a consecutive group
                if (previousMessage.senderId !== message.senderId) {
                  return isSentByAuthUser 
                    ? 'rounded-tr-lg rounded-br-none' 
                    : 'rounded-tl-lg rounded-bl-none';
                }
                
                // Middle messages in a consecutive group
                if (index < messages.length - 1 && messages[index + 1].senderId === message.senderId) {
                  return isSentByAuthUser 
                    ? 'rounded-r-none' 
                    : 'rounded-l-none';
                }
                
                // Last message in a consecutive group
                return isSentByAuthUser 
                  ? 'rounded-tr-lg rounded-br-lg rounded-bl-none' 
                  : 'rounded-tl-lg rounded-bl-lg rounded-br-none';
              };

              return (
                <div 
                  key={message._id} 
                  className={`flex flex-col ${isSentByAuthUser ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`
                      chat-bubble 
                      ${isSentByAuthUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'}
                      ${getBorderRadius()}
                      max-w-[70%]
                      ${isSameSender && isQuickSuccession ? 'mb-0.5' : 'mb-2'}
                    `}
                  >
                    {message.text && <p>{message.text}</p>}
                    {message.image && (
                      <ImageWithSkeleton 
                        src={message.image} 
                        alt="sent image" 
                        className="max-w-xs md:max-w-md mt-2"
                      />
                    )}
                  </div>
                  {/* Timestamp */}
                  <div className={`
                    text-xs text-gray-500 mt-1
                    ${isSameSender && isQuickSuccession ? 'invisible' : ''}
                  `}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <MessageInput />
    </div>
  );
};

export default Chat;
