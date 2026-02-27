import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage.jsx";
import IndividualProductPage from "./pages/IndividualProductPage.jsx";

import PrivateAdminRoute from "./pages/admin/PrivateAdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminStores from "./pages/admin/AdminStores.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminDiscounts from "./pages/admin/AdminDiscounts.jsx";

import PrivateSellerRoute from "./pages/seller/PrivateSellerRoute.jsx";
import SellerLayout from "./pages/seller/SellerLayout.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import SellerProducts from "./pages/seller/SellerProducts.jsx";

import PrivateBuyerRoute from "./pages/buyer/PrivateBuyerRoute.jsx";
import BuyerLayout from "./pages/buyer/BuyerLayout.jsx";
import BuyerProfile from "./pages/buyer/BuyerProfile.jsx";
import BuyerCart from "./pages/buyer/BuyerCart.jsx";
import BuyerOrders from "./pages/buyer/BuyerOrders.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route
          path="/products/:productId"
          element={<IndividualProductPage />}
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

        {/* Seller Routes */}
        <Route
          path="/seller"
          element={
            <PrivateSellerRoute>
              <SellerLayout />
            </PrivateSellerRoute>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route
            path="orders"
            element={
              <div className="p-8">
                <h1 className="text-2xl font-bold">Orders — Coming Soon</h1>
              </div>
            }
          />
          <Route
            path="profile"
            element={
              <div className="p-8">
                <h1 className="text-2xl font-bold">
                  Store Profile — Coming Soon
                </h1>
              </div>
            }
          />
          <Route
            path="questions"
            element={
              <div className="p-8">
                <h1 className="text-2xl font-bold">Questions — Coming Soon</h1>
              </div>
            }
          />
        </Route>

        {/* Buyer Routes */}
        <Route
          path="/buyer"
          element={
            <PrivateBuyerRoute>
              <BuyerLayout />
            </PrivateBuyerRoute>
          }
        >
          <Route path="profile" element={<BuyerProfile />} />
          <Route path="cart" element={<BuyerCart />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route
            path="reviews"
            element={
              <div className="p-8">
                <h1 className="text-2xl font-bold">Reviews — Coming Soon</h1>
              </div>
            }
          />
          <Route
            path="questions"
            element={
              <div className="p-8">
                <h1 className="text-2xl font-bold">Questions — Coming Soon</h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
