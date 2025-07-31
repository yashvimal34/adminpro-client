import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import socket from "./socket"; // <-- use shared socket
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./layout/MainLayout";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import NProgressLoader from "./components/Loader/NProgressLoader";
// import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/Common/PrivateRoute";
// import RegisterPage from "./pages/RegisterPage";
import MyProfilePage from "./pages/MyProfilePage";
import AuthPage from "./pages/AuthPage";

// CHANGED: Created a wrapper component to conditionally hide MainLayout
function AppRoutes() {  
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/register"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  // ---------------- SOCKET.IO CONNECTION ----------------
  useEffect(() => {
    // Use the shared socket (do NOT create a new connection)
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Remove product listeners from here to avoid duplicate updates.
    // ProductsPage will handle productAdded/Updated/Deleted.

    // Cleanup: remove only listeners, not disconnect
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  // -------------------------------------------------------

  return (
    <>
      <NProgressLoader />
      {shouldHideLayout ? (
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/my-profile" element={<MyProfilePage />} />
          </Routes>
        </MainLayout>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
