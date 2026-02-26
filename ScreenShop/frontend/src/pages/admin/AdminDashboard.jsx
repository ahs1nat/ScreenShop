import React, { useEffect, useState } from "react";
import {
  Store,
  Clock,
  Package,
  AlertCircle,
  Users,
  ShoppingCart,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStores: 0,
    pendingStores: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalCustomers: 0,
    totalSells: 0,
  });
  const [topSellers, setTopSellers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, sellersRes, productsRes] = await Promise.all([
          fetch("/api/admin/stats", { headers: authHeader }),
          fetch("/api/admin/top-sellers", { headers: authHeader }),
          fetch("/api/admin/top-products", { headers: authHeader }),
        ]);
        const [statsData, sellersData, productsData] = await Promise.all([
          statsRes.json(),
          sellersRes.json(),
          productsRes.json(),
        ]);
        if (statsData.success) setStats(statsData);
        if (sellersData.success) setTopSellers(sellersData.topSellers);
        if (productsData.success) setTopProducts(productsData.topProducts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: <Store size={28} />,
      desc: "Registered sellers",
      iconClass: "text-primary",
    },
    {
      title: "Pending Stores",
      value: stats.pendingStores,
      icon: <Clock size={28} />,
      desc: "Awaiting approval",
      iconClass: "text-warning",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package size={28} />,
      desc: "Listed products",
      iconClass: "text-secondary",
    },
    {
      title: "Pending Products",
      value: stats.pendingProducts,
      icon: <AlertCircle size={28} />,
      desc: "Awaiting approval",
      iconClass: "text-warning",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <Users size={28} />,
      desc: "Registered buyers",
      iconClass: "text-accent",
    },
    {
      title: "Total Sales",
      value: `$${stats.totalSells.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <ShoppingCart size={28} />,
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
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
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

      {/* Top Sellers & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Sellers */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title mb-2">🏆 Top Sellers</h2>
            {topSellers.length === 0 ? (
              <div className="alert alert-info">
                <span>No seller data yet.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Store</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellers.map((seller, index) => (
                      <tr key={seller.seller_id}>
                        <td className="font-bold">{index + 1}</td>
                        <td className="font-medium">{seller.store_name}</td>
                        <td>{seller.total_orders}</td>
                        <td className="font-semibold text-success">
                          $
                          {parseFloat(seller.total_revenue).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title mb-2">🔥 Top Products</h2>
            {topProducts.length === 0 ? (
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
                      <th>Store</th>
                      <th>Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={product.product_id}>
                        <td className="font-bold">{index + 1}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <div className="avatar">
                                <div className="mask mask-squircle w-10 h-10">
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="avatar placeholder">
                                <div className="mask mask-squircle w-10 h-10 bg-neutral text-neutral-content">
                                  <span className="text-xs">
                                    {product.name[0]}
                                  </span>
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs opacity-50">
                                ${parseFloat(product.price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm opacity-70">
                          {product.store_name}
                        </td>
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
    </div>
  );
}
