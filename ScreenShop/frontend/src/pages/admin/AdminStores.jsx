import React, { useEffect, useState } from "react";
import { Check, X, Trash2, Search } from "lucide-react";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    storeId: null,
  });

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stores", { headers: authHeader });
      const data = await res.json();
      if (data.success) setStores(data.stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`/api/admin/stores/${id}/approve`, {
      method: "PATCH",
      headers: authHeader,
    });
    if (res.ok) fetchStores();
  };

  const handleDelete = async () => {
    const id = confirmModal.storeId;
    setConfirmModal({ open: false, storeId: null });
    const res = await fetch(`/api/admin/stores/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) fetchStores();
  };

  const filteredStores = stores.filter((store) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && store.approved) ||
      (statusFilter === "pending" && !store.approved);

    const matchesSearch = store.store_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Stores Management</h1>

        {/* Search Bar */}
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search store name..."
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
                ? stores.length
                : tab === "approved"
                  ? stores.filter((s) => s.approved).length
                  : stores.filter((s) => !s.approved).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-base-200 rounded-2xl shadow overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300">
              <th>Store Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : filteredStores.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No stores found
                </td>
              </tr>
            ) : (
              filteredStores.map((store) => (
                <tr key={store.seller_id}>
                  <td>
                    <div className="font-bold">{store.store_name}</div>
                  </td>
                  <td>
                    <div className="text-sm font-medium">{store.name}</div>
                    <div className="text-xs opacity-50">{store.email}</div>
                  </td>
                  <td>
                    {store.approved ? (
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
                      {!store.approved ? (
                        <>
                          <button
                            onClick={() => handleApprove(store.seller_id)}
                            className="btn btn-sm btn-circle btn-success btn-soft"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                open: true,
                                storeId: store.seller_id,
                              })
                            }
                            className="btn btn-sm btn-circle btn-error btn-soft"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              storeId: store.seller_id,
                            })
                          }
                          className="btn btn-sm btn-outline btn-error gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
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
              Are you sure you want to delete this store? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmModal({ open: false, storeId: null })}
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
            onClick={() => setConfirmModal({ open: false, storeId: null })}
          />
        </div>
      )}
    </div>
  );
}
