import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isSigningUp, login } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username.trim()) {
      toast.error("Username is required!");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      await signUp(formData);
      toast.success("Account created successfully!");
  
      // Log in automatically after signup
      const success = await login({ username: formData.username, password: formData.password });
  
      if (success) {
        navigate("/");
      } else {
        navigate("/login"); // Fallback if login fails
      }
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
    }
  };
  
  

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-base-200 text-base-content overflow-hidden">
      {/* Left Side (Form Section) */}
      <div className="flex flex-col mb-8 justify-center items-center w-full lg:w-1/2 p-6 sm:p-12 pb-16 lg:pb-0">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-gray-500">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Username" 
              type="text" 
              icon={User} 
              placeholder="johndoe" 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            />

            <InputField 
              label="Email Address" 
              type="email" 
              icon={Mail} 
              placeholder="example@email.com" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />

            <div className="form-control">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-12 pr-10"
                  placeholder="Create password"
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
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer flex items-center gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="text-gray-500 text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">Sign in</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side (New Stylish Design) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-base-300 to-base-100 text-base-content p-12 items-center">
        <div className="max-w-lg mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Join the Community</h2>
          <p className="text-lg opacity-90">
            Connect, share, and communicate in real-time with people across the globe.
          </p>

          <div className="space-y-6">
            <Feature icon={MessageSquare} title="Real-time messaging" text="Instantly connect with friends and colleagues." />
            <Feature icon={Mail} title="File sharing" text="Share documents, photos, and videos seamlessly." />
            <Feature icon={Lock} title="Secure conversations" text="End-to-end encryption keeps your chats private." />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, type, icon: Icon, placeholder, value, onChange }) => (
  <div className="form-control">
    <label className="label">{label}</label>
    <div className="relative">
      <Icon className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type={type}
        className="input input-bordered w-full pl-12"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

// Feature Component
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

export default SignUpPage;
