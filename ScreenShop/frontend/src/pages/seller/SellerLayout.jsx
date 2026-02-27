import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  LogOut,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

export default function SellerLayout() {
  const menuItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Products", path: "/seller/products", icon: <Package size={18} /> },
    { name: "Orders", path: "/seller/orders", icon: <ShoppingCart size={18} /> },
    { name: "Store Profile", path: "/seller/profile", icon: <Store size={18} /> },
    { name: "Questions", path: "/seller/questions", icon: <MessageCircle size={18} /> },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-base-200 flex flex-col justify-between p-4">
        <div>
          <h1 className="text-xl font-bold mb-8 px-2">Seller Panel</h1>
          <ul className="menu menu-vertical w-full gap-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 ${
                      isActive ? "active bg-primary text-primary-content" : ""
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost w-full flex items-center gap-2"
          >
            <ExternalLink size={18} />
            View Marketplace
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="btn btn-ghost w-full text-error flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto bg-base-100">
        <Outlet />
      </main>
    </div>
  );
}