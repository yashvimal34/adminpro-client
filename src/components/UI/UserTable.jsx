import React, { useState } from "react";
import axios from "axios";
import EditUserForm from "./EditUserForm";

const UserTable = ({ users = [] }) => {
  // ✅ Fixed: useState moved inside the component
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (user) => setEditingUser(user);
  const handleEditSuccess = () => window.location.reload();

  const getRandomStatus = () => {
    const statuses = ["Active", "Inactive", "Pending"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User deleted successfully!");
      window.location.reload(); // refresh to reflect change
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-bold mb-4">Users</h2>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="px-6 py-3">Avatar</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {users.map((user) => {
                const status = user.status || getRandomStatus();
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="px-6 py-4">{user._id}</td>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          status === "Active"
                            ? "bg-green-100 text-green-700"
                            : status === "Inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          className="text-red-600 text-sm hover:underline"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {users.map((user) => {
            const status = user.status || getRandomStatus();
            return (
              <div
                key={user._id}
                className="bg-white shadow-sm rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border object-cover"
                  />
                  <div className="text-sm">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-semibold">ID:</span> {user._id}
                  </div>
                  <div>
                    <span className="font-semibold">Role:</span> {user.role}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Active"
                          ? "bg-green-100 text-green-700"
                          : status === "Inactive"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 text-sm hover:underline"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditUserForm
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}
    </>
  );
};

export default UserTable;
