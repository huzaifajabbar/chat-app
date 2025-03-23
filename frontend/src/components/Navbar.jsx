import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Home, User, Settings, LogIn, LogOut, MessageCircleDashed } from "lucide-react"; // Importing icons

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center text-white text-xl font-bold gap-2">
          <MessageCircleDashed className="size-6" />
          Chat App
        </Link> 

        {/* Navigation Links */}
        <ul className="flex items-center space-x-6">
          {/* Home */}
          <li>
            <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition">
              <Home className="size-5" />
              Home
            </Link>
          </li>

          {/* Profile (Only visible if logged in) */}
          {authUser && (
            <li>
              <Link to="/profile" className="flex items-center gap-2 text-white hover:text-gray-300 transition">
                <User className="size-5" />
                Profile
              </Link>
            </li>
          )}

          {/* Settings (Always visible) */}
          <li>
            <Link to="/settings" className="flex items-center gap-2 text-white hover:text-gray-300 transition">
              <Settings className="size-5" />
              Settings
            </Link>
          </li>

          {/* Authentication Actions */}
          <li>
            {authUser ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
              >
                <LogOut className="size-5" />
                Logout
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-green-400 hover:text-green-500 transition">
                <LogIn className="size-5" />
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
