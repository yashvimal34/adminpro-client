import { useState, useEffect } from "react"; // UPDATED: added useEffect
import { useNavigate } from "react-router-dom"; // ADDED
import axios from "axios"; // ADDED
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import loginAnimation from "../assets/animations/leftPanel.json";
import registerAnimation from "../assets/animations/rightPanel.json";

export default function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // NEW: detect mobile
  const navigate = useNavigate(); // ADDED

  // NEW: update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NEWLY ADDED: Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);
  // END NEWLY ADDED

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(
          "https://adminpro-server-n5dp.onrender.com/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/"); // ADDED redirect
      } else {
        // REGISTER
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (formData.avatar) data.append("avatar", formData.avatar);

        const res = await axios.post(
          "https://adminpro-server-n5dp.onrender.com/api/auth/register",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/"); // ADDED redirect
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // =======================
  // MOBILE/TABLET SIMPLE VIEW
  // =======================
  if (isMobile) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer select-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {!isLogin && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <span
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-2 cursor-pointer select-none"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>
            )}

            {!isLogin && (
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={toggleMode}
              className="text-indigo-600 underline"
            >
              {isLogin
                ? "New here? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =======================
  // DESKTOP (existing animation)
  // =======================
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="relative w-4/5 h-4/5 bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Animated Panel */}
        <motion.div
          animate={{ x: isLogin ? 0 : "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-white p-10"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            borderRadius: "1rem 0 0 1rem",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "loginAnimation" : "registerAnimation"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-72 h-72"
            >
              <Lottie
                animationData={isLogin ? loginAnimation : registerAnimation}
                loop={true}
              />
            </motion.div>
          </AnimatePresence>

          <h2 className="text-3xl font-bold mb-4">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>
          <p className="mb-6 text-center max-w-xs">
            {isLogin
              ? "Login to access your dashboard and analytics."
              : "Create your account to get started with our platform."}
          </p>

          <button
            onClick={toggleMode}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            {isLogin ? "New here? Register" : "Already have an account? Login"}
          </button>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          animate={{ x: isLogin ? "100%" : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center"
        >
          <div className="w-3/4 max-w-sm bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Register"}
            </h2>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer select-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {!isLogin && (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <span
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-2 cursor-pointer select-none"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              )}

              {!isLogin && (
                <input
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
