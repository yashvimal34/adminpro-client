import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false); // CHANGED: Added modal state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Inside Header component
  let user = null;
  try {
    const userJson = localStorage.getItem("user");
    user = userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    user = null;
  }

  const name = user?.name || "User";

  // CHANGED: Build avatar URL and fallback
  const avatar =
    user?.avatar && user.avatar.trim() !== ""
      ? user.avatar.startsWith("/uploads/") // CHANGED
        ? `http://localhost:5000${user.avatar}` // CHANGED
        : user.avatar // CHANGED
      : null; // CHANGED: no avatar fallback here

  // CHANGED: Function to generate initials
  const getInitials = (fullName) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/reports": "Reports",
    "/products": "Products",
    "/users": "Users",
    "/settings": "Settings",
    "/profile": "My Profile",
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <>
      <header className=" shadow px-6 py-4 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-gray-700"
        >
          ☰
        </button>

        <h1 className="text-xl font-semibold">{title}</h1>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-gray-600 hidden sm:inline">
              Welcome, <span className="font-semibold text-black">{name}</span>
            </span>

            {avatar ? (
              // CHANGED: Show image if avatar exists
              <img
                src={avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full border"
                title="Click to view full image"
                onClick={(e) => {
                  e.stopPropagation(); // CHANGED: stop dropdown
                  setShowImageModal(true); // CHANGED: open modal
                }}
              />
            ) : (
              // CHANGED: Show initials if no avatar
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(true); // CHANGED: open modal
                }}
                className="w-8 h-8 rounded-full border bg-blue-500 text-white flex items-center justify-center font-bold"
              >
                {getInitials(name)}
              </div>
            )}
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                🔚 Logout
              </button>

              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                <a href="/my-profile" className="...."> ✏️ Update Profile</a>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CHANGED: Modal for image/initials */}
      {showImageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Full avatar"
                className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold">
                {getInitials(name)}
              </div>
            )}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 text-lg shadow hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
