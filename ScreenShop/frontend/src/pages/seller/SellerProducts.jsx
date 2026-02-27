import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Check } from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  image_url: "",
  price: "",
  quantity: "",
  category_id: "",
};

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [viewModal, setViewModal] = useState({ open: false, product: null });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    productId: null,
  });

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seller/products", { headers: authHeader });
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/seller/categories", { headers: authHeader });
    const data = await res.json();
    if (data.success) setCategories(data.categories);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ── Handlers ──────────────────────────────────────────────
  const handleAdd = async () => {
    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...addForm,
        price: parseFloat(addForm.price),
        quantity: parseInt(addForm.quantity),
        category_id: parseInt(addForm.category_id),
      }),
    });
    const data = await res.json();
    if (data.success) {
      setAddModal(false);
      setAddForm(emptyForm);
      fetchProducts();
    }
  };

  const handleEditSave = async () => {
    const res = await fetch(
      `/api/seller/products/${viewModal.product.product_id}`,
      {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price),
          quantity: parseInt(editForm.quantity),
          category_id: parseInt(editForm.category_id),
        }),
      },
    );
    const data = await res.json();
    if (data.success) {
      setViewModal({ open: false, product: null });
      setEditMode(false);
      fetchProducts();
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.productId;
    setDeleteModal({ open: false, productId: null });
    const res = await fetch(`/api/seller/products/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) fetchProducts();
  };

  const openView = (product) => {
    setViewModal({ open: true, product });
    setEditMode(false);
    setEditForm({
      name: product.name,
      description: product.description || "",
      image_url: product.image_url || "",
      price: product.price,
      quantity: product.quantity,
      category_id: product.category_id,
    });
  };

  const closeView = () => {
    setViewModal({ open: false, product: null });
    setEditMode(false);
  };

  // ── Filter ─────────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && p.approved) ||
      (statusFilter === "pending" && !p.approved);
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Products</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search product..."
              className="input input-bordered input-sm w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setAddModal(true)}
          >
            <Plus size={16} />
            Add Product
          </button>
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
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.product_id}
                  className="cursor-pointer hover"
                  onClick={() => openView(product)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img src={product.image_url} alt={product.name} />
                          </div>
                        </div>
                      ) : (
                        <div className="avatar placeholder">
                          <div className="mask mask-squircle w-10 h-10 bg-neutral text-neutral-content">
                            <span className="text-sm">{product.name[0]}</span>
                          </div>
                        </div>
                      )}
                      <div className="font-bold">{product.name}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {product.category_name || "—"}
                    </span>
                  </td>
                  <td className="font-semibold">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge badge-outline ${product.quantity === 0 ? "badge-error" : product.quantity < 10 ? "badge-warning" : "badge-success"}`}
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
                  <td
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-sm btn-circle btn-warning btn-outline"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openView(product);
                          setEditMode(true);
                        }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-circle btn-error btn-outline"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal({
                            open: true,
                            productId: product.product_id,
                          });
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── View / Edit Modal ────────────────────────────── */}
      {viewModal.open && viewModal.product && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {editMode ? "Edit Product" : "Product Details"}
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={closeView}
              >
                <X size={16} />
              </button>
            </div>

            {/* Product image preview */}
            {(editMode ? editForm.image_url : viewModal.product.image_url) && (
              <img
                src={
                  editMode ? editForm.image_url : viewModal.product.image_url
                }
                alt="product"
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}

            <div className="space-y-3">
              {/* Name */}
              <div className="form-control">
                <label className="label label-text font-medium">
                  Product Name
                </label>
                {editMode ? (
                  <input
                    className="input input-bordered w-full"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  <p className="px-1">{viewModal.product.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label label-text font-medium">
                  Description
                </label>
                {editMode ? (
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                ) : (
                  <p className="px-1 text-sm opacity-70">
                    {viewModal.product.description || "—"}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div className="form-control">
                <label className="label label-text font-medium">
                  Image URL
                </label>
                {editMode ? (
                  <input
                    className="input input-bordered w-full"
                    value={editForm.image_url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, image_url: e.target.value })
                    }
                  />
                ) : (
                  <p className="px-1 text-sm opacity-50 truncate">
                    {viewModal.product.image_url || "—"}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="form-control">
                <label className="label label-text font-medium">Category</label>
                {editMode ? (
                  <select
                    className="select select-bordered w-full"
                    value={editForm.category_id}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category_id: e.target.value })
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="px-1">
                    {viewModal.product.category_name || "—"}
                  </p>
                )}
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label label-text font-medium">
                    Price ($)
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  ) : (
                    <p className="px-1">
                      ${parseFloat(viewModal.product.price).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label label-text font-medium">Stock</label>
                  {editMode ? (
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quantity: e.target.value })
                      }
                    />
                  ) : (
                    <p className="px-1">{viewModal.product.quantity}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              {!editMode && (
                <div className="form-control">
                  <label className="label label-text font-medium">Status</label>
                  <div className="px-1">
                    {viewModal.product.approved ? (
                      <span className="badge badge-success badge-outline">
                        Approved
                      </span>
                    ) : (
                      <span className="badge badge-warning badge-outline">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              {editMode ? (
                <>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-outline"
                    onClick={handleEditSave}
                  >
                    <Check size={16} />
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-ghost" onClick={closeView}>
                    Close
                  </button>
                  <button
                    className="btn btn-warning btn-outline"
                    onClick={() => setEditMode(true)}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-outline"
                    onClick={() => {
                      closeView();
                      setDeleteModal({
                        open: true,
                        productId: viewModal.product.product_id,
                      });
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeView} />
        </div>
      )}

      {/* ── Add Product Modal ────────────────────────────── */}
      {addModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add New Product</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => {
                  setAddModal(false);
                  setAddForm(emptyForm);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label label-text font-medium">
                  Product Name *
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter product name"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label label-text font-medium">
                  Description
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter description"
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label label-text font-medium">
                  Image URL
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="https://..."
                  value={addForm.image_url}
                  onChange={(e) =>
                    setAddForm({ ...addForm, image_url: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label label-text font-medium">
                  Category *
                </label>
                <select
                  className="select select-bordered w-full"
                  value={addForm.category_id}
                  onChange={(e) =>
                    setAddForm({ ...addForm, category_id: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label label-text font-medium">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    value={addForm.price}
                    onChange={(e) =>
                      setAddForm({ ...addForm, price: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label label-text font-medium">
                    Stock *
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="0"
                    value={addForm.quantity}
                    onChange={(e) =>
                      setAddForm({ ...addForm, quantity: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setAddModal(false);
                  setAddForm(emptyForm);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-outline"
                onClick={handleAdd}
                disabled={
                  !addForm.name ||
                  !addForm.price ||
                  !addForm.quantity ||
                  !addForm.category_id
                }
              >
                <Plus size={16} />
                Submit for Approval
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setAddModal(false);
              setAddForm(emptyForm);
            }}
          />
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────── */}
      {deleteModal.open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4 text-gray-500">
              Are you sure you want to delete this product? This cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteModal({ open: false, productId: null })}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-outline"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setDeleteModal({ open: false, productId: null })}
          />
        </div>
      )}
    </div>
  );
}
