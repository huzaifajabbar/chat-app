import React, { useState, useRef } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import { X, Image as ImageIcon, Send } from 'lucide-react';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessages } = useChatStore();

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove Image
  const removeImage = () => {
    setImagePreview(null);
  };

  // Handle Sending Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });

      // Reset input fields
      setText("");
      setImagePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-3 sm:p-4 w-full bg-base-100 border-t border-base-300">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Input & Buttons */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg">
          <input
            type="text"
            className="w-full bg-transparent outline-none text-sm sm:text-base"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Button (Now Visible on Mobile) */}
          <button
            type="button"
            className="btn btn-circle btn-sm sm:btn-md text-zinc-400 hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className={`btn btn-circle btn-sm sm:btn-md text-white ${
            text.trim() || imagePreview ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
