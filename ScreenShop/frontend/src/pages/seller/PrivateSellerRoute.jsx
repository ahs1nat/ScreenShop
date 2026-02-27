import { Navigate } from "react-router-dom";

export default function PrivateSellerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role !== "seller") return <Navigate to="/" replace />;
  return children;
}
