import React, { useEffect, useState } from "react";
import { Check, Trash2, Search } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    productId: null,
  });

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { headers: authHeader });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`/api/admin/products/${id}/approve`, {
      method: "PATCH",
      headers: authHeader,
    });
    if (res.ok) fetchProducts();
  };

  const handleDelete = async () => {
    const id = confirmModal.productId;
    setConfirmModal({ open: false, productId: null });
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && product.approved) ||
      (statusFilter === "pending" && !product.approved);

    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products Management</h1>

        {/* Search Bar */}
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search product name..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        {["all", "pending", "approved"].map((tab) => (
          <button
            key={tab}
            className={`tab tab-lg ${statusFilter === tab ? "tab-active font-bold" : ""}`}
            onClick={() => setStatusFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-2 badge badge-sm">
              {tab === "all"
                ? products.length
                : tab === "approved"
                  ? products.filter((p) => p.approved).length
                  : products.filter((p) => !p.approved).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-base-200 rounded-2xl shadow overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300">
              <th>Product</th>
              <th>Category</th>
              <th>Store</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.product_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={product.image_url} alt={product.name} />
                          </div>
                        </div>
                      ) : (
                        <div className="avatar placeholder">
                          <div className="mask mask-squircle w-12 h-12 bg-neutral text-neutral-content">
                            <span className="text-sm">{product.name[0]}</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-xs opacity-50 max-w-xs truncate">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {product.category_name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="text-sm opacity-70">
                    {product.store_name || "—"}
                  </td>
                  <td className="font-semibold">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge ${product.quantity === 0 ? "badge-error" : product.quantity < 10 ? "badge-warning" : "badge-success"} badge-outline`}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    {product.approved ? (
                      <span className="badge badge-success badge-outline">
                        Approved
                      </span>
                    ) : (
                      <span className="badge badge-warning badge-outline">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      {!product.approved && (
                        <button
                          onClick={() => handleApprove(product.product_id)}
                          className="btn btn-sm btn-circle btn-outline btn-success"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            productId: product.product_id,
                          })
                        }
                        className="btn btn-sm btn-circle btn-outline btn-error"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4 text-gray-500">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setConfirmModal({ open: false, productId: null })
                }
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setConfirmModal({ open: false, productId: null })}
          />
        </div>
      )}
    </div>
  );
}
