import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import PrivateAdminRoute from "./pages/admin/PrivateAdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminStores from "./pages/admin/AdminStores.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminDiscounts from "./pages/admin/AdminDiscounts.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Normal Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="card bg-base-100 shadow-xl p-8">
                <h1 className="text-3xl font-bold">Products Page</h1>
              </div>
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="card bg-base-100 shadow-xl p-8">
                <h1 className="text-3xl font-bold">About Us</h1>
              </div>
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="card bg-base-100 shadow-xl p-8">
                <h1 className="text-3xl font-bold">Contact Us</h1>
              </div>
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="card bg-base-100 shadow-xl p-8">
                <h1 className="text-3xl font-bold">Sign Up</h1>
              </div>
            </div>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <AdminLayout />
            </PrivateAdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="discounts" element={<AdminDiscounts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
