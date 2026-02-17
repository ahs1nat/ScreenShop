import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar bg-base-100 transition-all duration-200 ${isScrolled ? "shadow-lg" : "shadow-none"}`}>
      {/* Logo - Left */}
      <div className="flex-none">
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold">
          ScreenShop
        </Link>
      </div>

      {/* Center Navigation */}
      <div className="flex-1 flex justify-center hidden lg:flex">
        <div className="menu menu-horizontal gap-1">
          <Link to="/" className={`btn btn-ghost normal-case text-base ${location.pathname === "/" ? "text-blue-500" : ""}`}>
            Home
          </Link>

          <div className="dropdown dropdown-hover">
            <button className="btn btn-ghost normal-case text-base" tabIndex={0}>
              Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52" tabIndex={0}>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=electronics">Electronics</Link></li>
              <li><Link to="/products?category=toys">Toys</Link></li>
              <li><Link to="/products?category=stationery">Stationery</Link></li>
            </ul>
          </div>

          <Link to="/about" className="btn btn-ghost normal-case text-base">
            About Us
          </Link>

          <Link to="/contact" className="btn btn-ghost normal-case text-base">
            Contact
          </Link>
        </div>
      </div>

      {/* Right - Search and Join Now */}
      <div className="flex-none flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="input input-bordered input-sm w-24 md:w-64 h-10"
          />
          <button className="btn btn-ghost btn-sm btn-square -ml-10">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Join Now Button */}
        <Link
          to="/signup"
          className="btn btn-primary text-white btn-sm"
        >
          Join Now
        </Link>
      </div>
    </nav>
  );
}
