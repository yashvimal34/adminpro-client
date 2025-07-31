// ✅ STEP 3: Add frontend EditUserForm component used by admin

// src/components/UI/EditUserForm.jsx
import React, { useState } from "react";
import axios from "axios";

const EditUserForm = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    role: user.role,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://adminpro-server-n5dp.onrender.com/api/users/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">Edit User</h2>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded p-2" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded p-2" />
      <input name="avatar" value={formData.avatar} onChange={handleChange} placeholder="Avatar URL" className="w-full border rounded p-2" />
      <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded p-2">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  );
};

export default EditUserForm;