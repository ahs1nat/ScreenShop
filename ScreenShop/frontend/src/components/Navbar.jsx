import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // profile icon
import { signup, login } from "../api/auth.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const location = useLocation();

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if user info exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset password visibility when switching modes or closing modal
  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [authMode, isModalOpen]);

  // Icons for Password Toggle
  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.644C3.67 8.5 7.652 6 12 6c4.348 0 8.33 2.5 9.964 5.678a1.012 1.012 0 010 .644C20.33 15.5 16.348 18 12 18c-4.348 0-8.33-2.5-9.964-5.678z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );

  // Close modal on 'Esc' key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <nav className="w-full sticky top-0 z-[100]">
        {/* Navbar Container */}
        <div
          className={`navbar bg-base-100 ${isScrolled ? "shadow-md" : ""}`}
          style={{ height: "60px" }}
        >
          {/* Logo */}
          <div className="flex-none">
            <Link to="/" className="text-xl font-bold">
              ScreenShop
            </Link>
          </div>

          {/* Center Navigation (Desktop) */}
          <div className="flex-1 flex justify-center hidden lg:flex">
            <div className="flex gap-4">
              <Link
                to="/"
                className={`btn btn-link text-base ${
                  location.pathname === "/"
                    ? "underline font-semibold"
                    : "no-underline"
                }`}
              >
                Home
              </Link>

              {/* Products Dropdown */}
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className={`btn btn-link text-base text-base-content no-underline flex items-center gap-1`}
                >
                  Products
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/products">All Products</Link>
                  </li>
                  <li>
                    <Link to="/products?category=electronics">Electronics</Link>
                  </li>
                  <li>
                    <Link to="/products?category=toys">Toys</Link>
                  </li>
                  <li>
                    <Link to="/products?category=stationary">Stationary</Link>
                  </li>
                  <li>
                    <Link to="/products?category=fashion">Fashion</Link>
                  </li>
                </ul>
              </div>

              <Link
                to="/about"
                className={`btn btn-link text-base ${
                  location.pathname === "/about"
                    ? "underline font-semibold"
                    : "no-underline"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`btn btn-link text-base ${
                  location.pathname === "/contact"
                    ? "underline font-semibold"
                    : "no-underline"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-none flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered input-sm w-24 md:w-64 pl-10 border border-gray-300"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Right Side: Join Now OR Profile */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <FaUserCircle className="w-8 h-8 text-gray-700" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/profile">Edit Profile</Link>
                  </li>
                  <li>
                    <Link to="/cart">View Cart</Link>
                  </li>
                  <li>
                    <Link to="/orders">Orders</Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setUser(null);
                        window.location.reload(); //refresh page
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setIsModalOpen(true);
                }}
                className="!btn !btn-primary"
              >
                Join Now
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- AUTH MODAL --- */}
      {isModalOpen && (
        <div className="modal modal-open">
          {/* Backdrop */}
          <div
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Box */}
          <div
            className="modal-box relative p-8 max-w-md rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            {/* Close Icon */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>

            {/* Tab Switcher */}
            <div className="flex justify-center gap-6 mb-6 border-b border-base-300">
              <button
                onClick={() => setAuthMode("login")}
                className={`pb-2 px-2 flex items-center gap-2 transition-all ${
                  authMode === "login"
                    ? "font-bold border-b-2 border-primary text-base-content"
                    : "text-base-content/50"
                }`}
              >
                {/* Login SVG */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`pb-2 px-2 flex items-center gap-2 transition-all ${
                  authMode === "signup"
                    ? "font-bold border-b-2 border-primary text-base-content"
                    : "text-base-content/50"
                }`}
              >
                {/* Sign Up SVG */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  authMode === "signup" &&
                  e.target[2].value !== e.target[3].value
                ) {
                  alert("Passwords do not match");
                  return;
                }
                const formData = {
                  name: authMode === "signup" ? e.target[0].value : undefined, // Full name for signup only
                  email:
                    authMode === "signup"
                      ? e.target[1].value
                      : e.target[0].value, // Email input
                  password:
                    authMode === "signup"
                      ? e.target[2].value
                      : e.target[1].value, // Password input
                  phone: authMode === "signup" ? e.target[4].value : undefined, // Phone number
                  address:
                    authMode === "signup" ? e.target[5].value : undefined, // Delivery address
                  role: "buyer", // Default role for signup
                };
                try {
                  
                  const res =
                    authMode === "signup"
                      ? await signup(formData)
                      : await login(formData);

                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.user));

                  //Update navbar state to show profile icon
                  setUser(res.data.user);
                  setIsModalOpen(false);
                } catch (err) {
                  // --- Show error if login/signup fails ---
                  console.error(err.response?.data || err.message);
                  alert(err.response?.data?.message || "Something went wrong");
                }
              }}
            >
              {authMode === "signup" && (
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Full name"
                    className="input input-bordered w-full pl-2 border border-gray-300"
                    required
                  />
                </div>
              )}

              <div className="form-control">
                <input
                  type="email"
                  placeholder="Email address"
                  className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                  required
                />
              </div>

              <div className="form-control">
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                  required
                />
                {authMode === "login" && (
                  <label className="label">
                    <span className="label-text-alt text-sm cursor-pointer">
                      Forgot password?
                    </span>
                  </label>
                )}
              </div>

              {authMode === "signup" && (
                <>
                  <div className="form-control">
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <input
                      type="text"
                      placeholder="Delivery address"
                      className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                      required
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full mt-4 !text-white !bg-primary"
              >
                {authMode === "login" ? "Log In" : "Create an account"}
              </button>

              {/* Switcher Text */}
              <div className="text-center mt-4">
                <span className="text-sm text-base-content/70">
                  {authMode === "login"
                    ? "Don't have an account yet? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode(authMode === "login" ? "signup" : "login")
                    }
                    className="btn btn-link p-0 text-sm"
                  >
                    {authMode === "login" ? "Sign up" : "Log in"}
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
