import React, { useState } from "react"; 
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom"; // Changed to Link component
import { MessageSquare, User, Lock, Eye, EyeOff, Upload } from "lucide-react"; // Added Upload icon
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
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error) {
      // Error already handled by store, but we can add additional handling here
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-900 text-white">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Login</h1>
              <p className="text-gray-400">Welcome back to your account</p> {/* Updated text */}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 z-10 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 bg-gray-800 text-white border-gray-700"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 z-10 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 bg-gray-800 text-white border-gray-700"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>

            {/* Sign-up Link */}
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex bg-primary text-primary-content">
        <div className="flex flex-col justify-center p-12 w-full">
          <div className="max-w-lg mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Connect with us</h2>
              <p className="text-lg opacity-90">
                Join our community of millions and start sharing your ideas today.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Real-time messaging</h3>
                  <p className="opacity-80">Connect with friends and colleagues instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Upload className="size-5" /> {/* Changed to Upload icon */}
                </div>
                <div>
                  <h3 className="font-medium text-lg">File sharing</h3>
                  <p className="opacity-80">Share documents, photos, and more with ease</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">End-to-end encryption</h3>
                  <p className="opacity-80">Your conversations are secure and private</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/5 p-6 rounded-xl">
              <p className="italic opacity-90 mb-4">
                "This platform has completely transformed how our team communicates. The interface is intuitive and the features are exactly what we needed."
              </p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20"></div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="opacity-70 text-sm">Product Manager, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;