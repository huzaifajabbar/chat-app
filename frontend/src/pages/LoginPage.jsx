import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, User, Lock, Eye, EyeOff, Upload } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const validateForm = () => {
    const { username, password } = formData;
    let isValid = true;
    
    if (!username.trim()) {
      toast.error("Username is required!");
      isValid = false;
    }
    if (!password.trim()) {
      toast.error("Password is required!");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      const success = await login(formData);
      if (success) {
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200 text-base-content">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Login</h1>
              <p className="text-gray-500">Welcome back to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-12"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-12 pr-10"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-gray-500">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-full bg-gradient-to-r from-base-300 to-base-100 text-base-content p-12 items-center">
        <div className="max-w-lg mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Join the Community</h2>
          <p className="text-lg opacity-90">
            Connect, share, and communicate in real-time with people across the globe.
          </p>

          <div className="space-y-6">
            <Feature icon={MessageSquare} title="Real-time messaging" text="Instantly connect with friends and colleagues." />
            <Feature icon={Upload} title="File sharing" text="Share documents, photos, and videos seamlessly." />
            <Feature icon={Lock} title="Secure conversations" text="End-to-end encryption keeps your chats private." />
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, title, text }) => (
  <div className="flex items-start gap-4">
    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="size-6 text-primary" />
    </div>
    <div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="opacity-80">{text}</p>
    </div>
  </div>
);

export default LoginPage;
