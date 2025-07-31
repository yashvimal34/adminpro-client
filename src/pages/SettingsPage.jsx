// pages/SettingsPage.jsx


import { useEffect, useState } from "react";
import axios from "axios";
// import RegisterPage from "./AuthPage";
// import LoginPage from "./AuthPage";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(""); // "", "login", or "register"
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/settings")
      .then(res => {
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setEmailNotifications(res.data.receiveEmails || false);
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        setMessage("❌ Failed to load settings");
      });
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5000/api/users/profile/me", {
  name,
  email,
  receiveEmails: emailNotifications
      });
      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save settings", err);
      setMessage("❌ Failed to save settings");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {message && (
        <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded-lg">
          {message}
        </div>
      )}

      
      {/* <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Account</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowLogin(true)}
          className={`px-2 py-2 rounded ${showLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Login
        </button>
        <button
          onClick={() => setShowLogin(false)}
          className={`px-4 py-2 rounded ${!showLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Register
        </button>
      </div>

      
   </div> */}
   

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-shrink-0">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="border rounded-lg px-4 py-2 w-full"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          Receive Email Notifications
        </label>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 text-sm"
            disabled
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
