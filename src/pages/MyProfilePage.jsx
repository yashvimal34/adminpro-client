import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ to redirect after update

export default function MyProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null, // CHANGED: was "" (string) now null to support file
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // ✅ to redirect user

  // ✅ Fetch current user's profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, email, avatar } = res.data;
        setFormData({ name, email, avatar, password: "" }); // (kept same)
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err);
        setMessage("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value, type, files } = e.target; // CHANGED
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value, // CHANGED: support file input
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // CHANGED: Use FormData to send files
      const data = new FormData(); // CHANGED
      data.append("name", formData.name); // CHANGED
      data.append("email", formData.email); // CHANGED
      if (formData.password) data.append("password", formData.password); // CHANGED
      // CHANGED: handle both cases - file or string
if (formData.avatar) {
  if (typeof formData.avatar === "string") {
    data.append("avatar", formData.avatar);
  } else {
    data.append("avatar", formData.avatar); // file
  }
}


      await axios.put("http://localhost:5000/api/users/profile/me", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // CHANGED
        },
      });

      // ✅ Step 2: Fetch updated profile data
      const res = await axios.get("http://localhost:5000/api/users/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = res.data;

      // ✅ Step 3: Update localStorage with fresh user info
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" })); // ✅ Clear password field

      // ✅ Step 4: Optional redirect to refresh UI
      setTimeout(() => {
        navigate("/"); // ✅ Redirect to dashboard or home
      }, 1000);

    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>

      {/* ✅ Message section */}
      {message && (
        <div
          className={`mb-4 text-center text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border px-3 py-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Avatar</label>
          <input
            type="file" // CHANGED: was type text
            name="avatar" // CHANGED
            accept="image/*" // CHANGED
            onChange={handleChange} // CHANGED
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">New Password</label>
          <input
            type="password"
            name="password"
            className="w-full border px-3 py-2 rounded"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
