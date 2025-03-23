import React, { useState } from "react"; 
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { MessageSquare, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isSigningUp } = useAuthStore();
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username.trim()) return toast.error("Username is required!");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format!");
    if (password.length < 8) return toast.error("Password must be at least 8 characters!");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await signUp(formData); // Wait for sign-up to complete
      toast.success("Account created successfully!");
      navigate("/"); // Redirect to homepage
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
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
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-gray-400">Get started with your free account</p>
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

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-200">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 z-10 text-gray-500" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 bg-gray-800 text-white border-gray-700"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  placeholder="Create password"
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
              <label className="label">
                <span className="label-text-alt text-xs text-gray-400">Password must be at least 8 characters</span>
              </label>
            </div>

            {/* Terms and Conditions */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                <span className="label-text text-gray-300">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? "Creating Account..." : "Create Account"}
            </button>

            {/* Sign-in Link */}
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline">Sign in</a>
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
            <Mail className="size-5" />
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

export default SignUpPage;
