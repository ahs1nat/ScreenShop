// src/pages/buyer/PrivateBuyerRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateBuyerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role !== "buyer") return <Navigate to="/" replace />;
  return children;
}
