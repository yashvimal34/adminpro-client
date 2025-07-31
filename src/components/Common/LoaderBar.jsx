import React from "react";

export default function LoaderBar() {
  return (
    <div className="w-full h-1 fixed top-0 left-0 z-50">
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
    </div>
  );
}