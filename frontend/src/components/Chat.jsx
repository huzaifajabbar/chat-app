import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import MessagesSkeleton from './MessagesSkeleton.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';

const Chat = () => {
  const { 
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedUser, 
    subscribeToMessages, 
    unsubscribeFromMessages 
  } = useChatStore();
  const { authUser, isCheckingAuth, onlineUsers } = useAuthStore();
  const messagesContainerRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isCheckingAuth) {
      setIsInitializing(false);
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    if (selectedUser?._id && authUser?._id) {
      const initialize = async () => {
        await getMessages(selectedUser._id);
        subscribeToMessages();
      };

      initialize();

      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?._id, authUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

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
                      <img 
                        src={message.image} 
                        alt="sent image" 
                        className="rounded-lg max-w-xs mt-2"
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