import React from "react";
import { Navigate } from "react-router-dom";

export default function WriterProtectedRoutes({ Component }) {
  const login = localStorage.getItem("loginstatus");
  const role = localStorage.getItem("role"); // "admin" | "writer"

  if (!login) return <Navigate to="/sign-in" replace />;

  // Only writers allowed here
  if (role !== "writer") {
    // If an admin tries to access writer routes, send to admin home
    return <Navigate to="/" replace />;
  }

  return <Component />;
}
