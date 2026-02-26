import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [addModal, setAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Edit modal
  const [editModal, setEditModal] = useState({
    open: false,
    categoryId: null,
    name: "",
  });

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    categoryId: null,
  });

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { headers: authHeader });
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    if (res.ok) {
      setAddModal(false);
      setNewCategoryName("");
      fetchCategories();
    }
  };

  const handleEdit = async () => {
    if (!editModal.name.trim()) return;
    const res = await fetch(`/api/admin/categories/${editModal.categoryId}`, {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ name: editModal.name.trim() }),
    });
    if (res.ok) {
      setEditModal({ open: false, categoryId: null, name: "" });
      fetchCategories();
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.categoryId;
    setDeleteModal({ open: false, categoryId: null });
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) fetchCategories();
  };

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          className="btn btn-primary btn-soft gap-2"
          onClick={() => setAddModal(true)}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-base-200 rounded-2xl shadow overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300">
              <th>#</th>
              <th>Category Name</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-10">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((c, index) => (
                <tr key={c.category_id}>
                  <td className="font-bold">{index + 1}</td>
                  <td className="font-medium">{c.name}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-sm btn-circle btn-warning btn-outline"
                        title="Edit"
                        onClick={() =>
                          setEditModal({
                            open: true,
                            categoryId: c.category_id,
                            name: c.name,
                          })
                        }
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-circle btn-error btn-outline"
                        title="Delete"
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            categoryId: c.category_id,
                          })
                        }
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

      {/* Add Modal */}
      {addModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Category</h3>
            <input
              type="text"
              placeholder="Category name..."
              className="input input-bordered w-full"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setAddModal(false);
                  setNewCategoryName("");
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary btn-soft" onClick={handleAdd}>
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setAddModal(false);
              setNewCategoryName("");
            }}
          />
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Category</h3>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editModal.name}
              onChange={(e) =>
                setEditModal({ ...editModal, name: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setEditModal({ open: false, categoryId: null, name: "" })
                }
              >
                Cancel
              </button>
              <button className="btn btn-warning btn-soft" onClick={handleEdit}>
                <Check size={16} />
                Save
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() =>
              setEditModal({ open: false, categoryId: null, name: "" })
            }
          />
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4 text-gray-500">
              Are you sure you want to delete this category? Products under this
              category may be affected.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setDeleteModal({ open: false, categoryId: null })
                }
              >
                Cancel
              </button>
              <button className="btn btn-error btn-soft" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setDeleteModal({ open: false, categoryId: null })}
          />
        </div>
      )}
    </div>
  );
}
