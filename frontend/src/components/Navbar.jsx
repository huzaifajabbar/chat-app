import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Home, User, Settings, LogIn, LogOut, MessageCircleDashed, Menu, X } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar bg-base-200 shadow-lg px-4 relative">
      <div className="container mx-auto flex justify-between items-center w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-bold gap-2 text-primary">
          <MessageCircleDashed className="size-6" />
          Miracle
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-6">
          <li>
            <Link to="/" className="btn btn-ghost flex items-center gap-2">
              <Home className="size-5" />
              Home
            </Link>
          </li>
          {authUser && (
            <li>
              <Link to="/profile" className="btn btn-ghost flex items-center gap-2">
                <User className="size-5" />
                Profile
              </Link>
            </li>
          )}
          <li>
            <Link to="/settings" className="btn btn-ghost flex items-center gap-2">
              <Settings className="size-5" />
              Settings
            </Link>
          </li>
          <li>
            {authUser ? (
              <button onClick={logout} className="btn btn-error flex items-center gap-2">
                <LogOut className="size-5" />
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-success flex items-center gap-2">
                <LogIn className="size-5" />
                Login
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="lg:hidden btn btn-ghost" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        {/* Mobile Dropdown Menu (Overlapping, not expanding) */}
        {isOpen && (
          <div className="absolute right-4 top-16 bg-base-300 shadow-xl rounded-lg p-4 w-48 z-50 animate-fade-in">
            <ul className="space-y-3">
              <li>
                <Link to="/" className="btn btn-ghost w-full flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Home className="size-5" />
                  Home
                </Link>
              </li>
              {authUser && (
                <li>
                  <Link to="/profile" className="btn btn-ghost w-full flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <User className="size-5" />
                    Profile
                  </Link>
                </li>
              )}
              <li>
                <Link to="/settings" className="btn btn-ghost w-full flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Settings className="size-5" />
                  Settings
                </Link>
              </li>
              <li>
                {authUser ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="btn btn-error w-full flex items-center gap-2"
                  >
                    <LogOut className="size-5" />
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-success w-full flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <LogIn className="size-5" />
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;