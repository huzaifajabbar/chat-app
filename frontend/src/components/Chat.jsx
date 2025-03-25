import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import MessagesSkeleton from "./MessagesSkeleton.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import ImageWithSkeleton from "./ImageWithSkeleton.jsx";

const Chat = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser, isCheckingAuth } = useAuthStore();
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id && authUser?._id) {
      getMessages(selectedUser._id);
      const handler = subscribeToMessages();
      return unsubscribeFromMessages;
    }
  }, [selectedUser?._id, authUser?._id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isCheckingAuth || !authUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto justify-center items-center">
        {isCheckingAuth ? <span className="loading loading-spinner loading-lg"></span> : <p className="text-gray-500">Please log in to start chatting</p>}
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
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
              const previousMessage = messages[index - 1] || {};
              const isSameSender = previousMessage.senderId === message.senderId;
              const isQuickSuccession = previousMessage.createdAt && (new Date(message.createdAt) - new Date(previousMessage.createdAt)) < 300000;

              return (
                <div key={message._id} className={`flex flex-col ${isSentByAuthUser ? "items-end" : "items-start"}`}>
                  <div className={`chat-bubble ${isSentByAuthUser ? "chat-bubble-primary" : "chat-bubble-secondary"} max-w-[70%]`}>
                    {message.text && <p>{message.text}</p>}
                    {message.image && <ImageWithSkeleton src={message.image} alt="sent image" className="max-w-xs md:max-w-md mt-2" />}
                  </div>
                  {!isSameSender || !isQuickSuccession ? (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  ) : null}
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
