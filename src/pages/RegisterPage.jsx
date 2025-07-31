// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Lottie from "lottie-react";
// import leftPanelAnimation from "../assets/animations/leftPanel.json"; // <-- Added this line

// export default function RegisterPage() {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "", // CHANGED
//         avatar: null
//     });

//     const [showPassword, setShowPassword] = useState(false); // CHANGED
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false); // CHANGED
//     const [passwordStrength, setPasswordStrength] = useState(""); // CHANGED
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));

//         if (name === "password") {
//             setPasswordStrength(getPasswordStrength(value));
//         }
//     };

//     const getPasswordStrength = (password) => {
//         if (password.length < 6) return "weak";
//         if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password))
//             return "strong";
//         return "medium";
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (formData.password !== formData.confirmPassword) {
//             setError("Passwords do not match");
//             return;
//         }

//         try {
//             const data = new FormData();
//             data.append("name", formData.name);
//             data.append("email", formData.email);
//             data.append("password", formData.password);
//             if (formData.avatar) {
//                 data.append("avatar", formData.avatar);
//             }

//             const res = await axios.post("http://localhost:5000/api/auth/register", data, {
//                 headers: { "Content-Type": "multipart/form-data" }
//             });

//             localStorage.setItem("token", res.data.token);
//             localStorage.setItem("user", JSON.stringify(res.data.user));

//             navigate("/");
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.message || "Registration failed");
//         }
//     };

//     return (
//         <div 
//   className="min-h-screen flex flex-col lg:flex-row bg-cover bg-center"
//   style={{
//     backgroundImage: `url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1920&q=80')`,
//   }}
// >
//   {/* LEFT PANEL - Company Branding */}
//   {/* LEFT PANEL - Company Branding */}
// <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-black/50 backdrop-blur-md">
//   <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
//     DashSphere
//   </h1>
//   <p className="text-lg text-center text-gray-200 max-w-md mb-6">
//     Empowering your business with modern dashboards and analytics.
//   </p>

//   <div className="hidden lg:flex w-1/2 items-center justify-center">
//   <Lottie animationData={leftPanelAnimation} loop={true} />
// </div>

// </div>

//   {/* RIGHT PANEL - Registration Form */}
//   <div className="flex-1 flex items-center justify-center p-6">
//     <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-8">
//       <h2 className="text-3xl font-bold text-center text-white mb-6">Create an Account</h2>

//       {error && (
//         <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block text-white mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-white mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-white mb-1">Password</label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-2 text-black"
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <label className="block text-white mb-1">Confirm Password</label>
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-2 text-black"
//             >
//               {showConfirmPassword ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         {/* Avatar */}
//         <div>
//           <label className="block text-white mb-1">Avatar (optional)</label>
//           <input
//             type="file"
//             name="avatar"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
//         >
//           Register
//         </button>
//       </form>

//       <p className="mt-4 text-sm text-center text-white">
//         Already have an account?{" "}
//         <a href="/login" className="text-blue-200 hover:underline">Login</a>
//       </p>
//     </div>
//   </div>
// </div>

//     );
// }
