import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import EmptyChat from "../components/EmptyChat";
import Chat from "../components/Chat";
import { useChatStore } from "../store/useChatStore";
import { Contact, X } from "lucide-react";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-full w-full flex bg-base-200 overflow-hidden">
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 
          md:static 
          md:w-64 
          bg-base-100 
          shadow-lg 
          transition-all 
          duration-300 
          transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 
          w-64 
          max-w-full 
          h-full
        `}
      >
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)} 
          isMobile={!isSidebarOpen && window.innerWidth < 768}
        />
      </div>

      <button 
        className={`
          md:hidden 
          fixed 
          bottom-4 
          left-4 
          bg-primary 
          p-2 
          rounded-full 
          text-white 
          shadow-lg 
          z-50
          ${isSidebarOpen ? "hidden" : ""}
        `} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Contact size={24} />
      </button>

      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-full relative overflow-hidden">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser ? <EmptyChat /> : <Chat />}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div 
          className="
            md:hidden 
            fixed 
            inset-0 
            bg-black 
            bg-opacity-50 
            z-30
          " 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;