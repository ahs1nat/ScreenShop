import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Package,
  Tag,
  Percent,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Stores", path: "/admin/stores", icon: <Store size={18} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
    { name: "Categories", path: "/admin/categories", icon: <Tag size={18} /> },
    {
      name: "Discounts",
      path: "/admin/discounts",
      icon: <Percent size={18} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 flex flex-col justify-between p-4">
        <div>
          <h1 className="text-xl font-bold mb-8 px-2">Admin Panel</h1>
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

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn btn-ghost w-full text-error flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto bg-base-100">
        <Outlet />
      </main>
    </div>
  );
}
