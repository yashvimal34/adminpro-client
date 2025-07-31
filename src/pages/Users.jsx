import React, { useEffect, useState } from "react";
import axios from "axios";
import UserWelcomePanel from "../components/UI/UserWelcomePanel"; // ✅ custom panel for non-admin users

const getStatus = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 ";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "inactive":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  // Editing
  const [editingUser, setEditingUser] = useState(null);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // ✅ NEW: get current logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")); // <-- added

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://adminpro-server-n5dp.onrender.com/api/users?page=${page}&limit=5&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const openEdit = (user) => {
    setEditingUser(user);
    setRole(user.role);
    setStatus(user.status);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://adminpro-server-n5dp.onrender.com/api/users/${editingUser._id}`,
        { role, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err.response?.data || err);
      alert("Update failed");
    }
  };

  // --- Delete user ---
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://adminpro-server-n5dp.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err);
      alert("Delete failed");
    }
  };

  // ✅ If the logged-in user exists and is NOT admin, show welcome panel
  //    This prevents a blank screen for regular users
  if (currentUser && currentUser.role !== "admin") {
    return <UserWelcomePanel currentUser={currentUser} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border rounded-md w-64"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <>
          {/* --- Desktop Table --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{u.name}</td>
                    <td className="py-2 px-4 border">{u.email}</td>
                    <td className="py-2 px-4 border">{u.role}</td>
                    <td
                      className={`py-2 px-4 border ${getStatus(u.status)}`}
                    >
                      {u.status}
                    </td>
                    <td className="py-2 px-4 border flex gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Mobile Cards --- */}
          <div className="md:hidden grid grid-cols-1 gap-4 w-full">
            <div className="flex flex-col gap-4">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="border rounded-lg p-4 shadow-sm bg-white w-full"
                >
                  <h2 className="font-semibold text-lg">{u.name}</h2>
                  <p className="text-gray-600">{u.email}</p>
                  <p className="mt-1">
                    <span className="font-medium">Role:</span> {u.role}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {u.status}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Pagination --- */}
          <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* --- Edit Modal --- */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Edit User: {editingUser.name}
            </h2>
            <label className="block mb-2">
              Role:
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block mb-4">
              Status:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
