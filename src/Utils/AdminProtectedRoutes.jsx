import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoutes({ Component }) {
  const loggedIn = localStorage.getItem("loginstatus");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  

  if (!loggedIn) return <Navigate to="/sign-in" replace />;

  // Only admins allowed; writers get kicked to their home
  if (role !== "admin") return <Navigate to="/writer" replace />;

  return <Component />;
}
