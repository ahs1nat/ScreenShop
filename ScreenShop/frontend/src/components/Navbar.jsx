import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // profile icon
import { signup, login } from "../api/auth.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Link
              to="/"
              className="text-xl font-bold normal-case no-underline text-base-content"
            >
              ScreenShop
            </Link>
          </div>

          {/* Center Navigation (Desktop) */}
          <div className="flex-1 flex justify-center hidden lg:flex">
            <div className="flex gap-4">
              <Link
                to="/"
                className={`px-3 py-3 text-base font-medium text-base-content hover:text-primary transition-colors ${
                  location.pathname === "/"
                    ? "underline font-semibold text-primary"
                    : ""
                }`}
              >
                Home
              </Link>

              {/* Products Dropdown */}
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className={`px-3 py-3 text-base font-medium text-base-content hover:text-primary transition-colors flex items-center gap-1 cursor-pointer`}
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
                className={`px-3 py-3 text-base font-medium text-base-content hover:text-primary transition-colors ${
                  location.pathname === "/about"
                    ? "underline font-semibold text-primary"
                    : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-3 text-base font-medium text-base-content hover:text-primary transition-colors ${
                  location.pathname === "/contact"
                    ? "underline font-semibold text-primary"
                    : ""
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
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-circle"
              title="Toggle theme"
            >
              {isDark ? (
                // Sun icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              ) : (
                // Moon icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </button>
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
                  {user?.role === "admin" && (
                    <li>
                      <Link to="/admin/dashboard">Admin Dashboard</Link>
                    </li>
                  )}
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
                className="btn btn-sm btn-primary"
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

                  const user = res.data.user;
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(user));

                  //Update navbar state to show profile icon
                  setUser(user);
                  setIsModalOpen(false);

                  if (user.role === "admin") {
                    navigate("/admin/dashboard"); // <-- admin page
                  } else if (user.role === "seller") {
                    navigate("/seller/home");
                  } else {
                    navigate("/"); // buyer homepage
                  }
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
              <button type="submit" className="btn btn-primary w-full mt-4">
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
