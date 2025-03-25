import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { Users, X } from "lucide-react";

const Sidebar = ({ onClose, isMobile }) => {
  const { users, isUsersLoading, getUsers, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full border-r border-base-300 flex flex-col relative">
      {/* Close button for mobile */}
      {isMobile && (
        <button 
          className="
            md:hidden
            absolute 
            top-2 
            right-2 
            z-10 
            bg-base-200 
            p-2 
            rounded-full 
            hover:bg-base-300 
            transition-colors
          "
          onClick={onClose}
        >
          <X size={24} />
        </button>
      )}

      <div className="border-b border-base-300 w-full p-5 pr-12 relative">
        <div className="flex items-center gap-2">
          <Users className={`size-6 ${isMobile ? 'hidden' : ''}`} />
          <span className="font-medium hidden md:block">Contacts</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          return (
            <button 
              key={user._id} 
              onClick={() => {
                setSelectedUser(user);
                onClose && onClose();
              }} 
              className={`
                w-full 
                p-3 
                flex 
                items-center 
                gap-3 
                hover:bg-base-300 
                transition-colors 
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative">
                <img 
                  src={user.profilePic || "/avatar.png"} 
                  alt={user.name} 
                  className="size-12 object-cover rounded-full" 
                />
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="font-medium truncate">@{user.username}</div>
                <div className="text-sm text-zinc-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users available</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;