// src/components/Loader/NProgressLoader.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./nprogress.css"; // Custom style

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function NProgressLoader() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
    }, 500); // You can reduce/increase as needed
  }, [location]);

  return null;
}
