// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // CHANGED: added state for toggling password visibility
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await axios.post("https://adminpro-server-n5dp.onrender.com/api/auth/login", formData);

//       // Save token and user info
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // Redirect to dashboard
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Login failed. Try again.");
//     }
//   };

//   return (


//       <div 
//   className="min-h-screen flex items-center justify-center bg-cover bg-center"
//   style={{
//     backgroundImage: `url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1920&q=80')`,
//   }}>
//   <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-8">
//     <h2 className="text-3xl font-bold text-center text-white mb-6">YourCompany</h2>


//     <div className=" flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

//         {error && (
//           <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">{error}</div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Password</label>
//             <div className="relative"> {/* CHANGED: wrapper for eye icon */}
//               <input
//                 type={showPassword ? "text" : "password"} // CHANGED: toggle input type
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" // CHANGED: added padding for eye icon
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-2 text-gray-600" // CHANGED: eye button styling
//                 onClick={() => setShowPassword((prev) => !prev)} // CHANGED: toggle state
//               >
//                 {showPassword ? "🙈" : "👁️"} {/* CHANGED: toggle icon */}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
//           >
//             Login
//           </button>

//           <p className="mt-4 text-sm text-center text-gray-600">
//             Don't have an account?{" "}
//             <a href="/register" className="text-blue-600 hover:underline">Sign Up</a>
//           </p>

//         </form>
//       </div>
//     </div>
//           </div>
//     </div>
//   );
// }



// // Make more beautiful and attractive  as register page you updated
// // and update in this and comment that line where you have changed but be careful that don't change anything else so other functionality do not work 