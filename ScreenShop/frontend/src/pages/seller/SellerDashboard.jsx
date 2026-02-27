import { useEffect, useState } from "react";
import { Package, ShoppingCart, Clock, DollarSign } from "lucide-react";

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetch("/api/seller/stats", { headers: authHeader })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package size={28} />,
      desc: "Listed in store",
      iconClass: "text-primary",
    },
    {
      title: "Pending Approval",
      value: stats.pendingProducts,
      icon: <Clock size={28} />,
      desc: "Awaiting admin review",
      iconClass: "text-warning",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart size={28} />,
      desc: "Orders received",
      iconClass: "text-secondary",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <Clock size={28} />,
      desc: "Need processing",
      iconClass: "text-warning",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <DollarSign size={28} />,
      desc: "From delivered orders",
      iconClass: "text-success",
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-base-100">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat) => (
          <div key={stat.title} className="stat bg-base-200 rounded-2xl shadow">
            <div className={`stat-figure ${stat.iconClass}`}>{stat.icon}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value text-2xl">{stat.value}</div>
            <div className="stat-desc">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title mb-2">🔥 Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <div className="alert alert-info">
              <span>No product data yet.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map((product, index) => (
                    <tr key={product.product_id}>
                      <td className="font-bold">{index + 1}</td>
                      <td className="font-medium">{product.name}</td>
                      <td className="text-sm opacity-70">
                        {product.category_name || "—"}
                      </td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td>{product.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
