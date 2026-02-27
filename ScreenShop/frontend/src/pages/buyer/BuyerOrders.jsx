import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const statusColors = {
  pending: "badge-warning",
  confirmed: "badge-info",
  shipped: "badge-primary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: null,
  });
  const [statusFilter, setStatusFilter] = useState("all");

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/my-orders", { headers: authHeader });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderItems = async (orderId) => {
    if (orderItems[orderId]) return; // already fetched
    try {
      const res = await fetch(`/api/orders/${orderId}/items`, {
        headers: authHeader,
      });
      const data = await res.json();
      if (data.success) {
        setOrderItems((prev) => ({ ...prev, [orderId]: data.data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      fetchOrderItems(orderId);
    }
  };

  const handleCancel = async () => {
    const id = cancelModal.orderId;
    setCancelModal({ open: false, orderId: null });
    const res = await fetch(`/api/orders/${id}/cancel`, {
      method: "PATCH",
      headers: authHeader,
    });
    if (res.ok) fetchOrders();
  };

  const filtered = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter,
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {/* Status Filter Tabs */}
      <div className="tabs tabs-bordered mb-6">
        {[
          "all",
          "pending",
          "confirmed",
          "shipped",
          "delivered",
          "cancelled",
        ].map((tab) => (
          <button
            key={tab}
            className={`tab ${statusFilter === tab ? "tab-active font-bold" : ""}`}
            onClick={() => setStatusFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-2 badge badge-sm">
              {tab === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info">
          <span>No orders found.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <div key={order.order_id} className="card bg-base-200 shadow">
              {/* Order Header */}
              <div
                className="card-body py-4 cursor-pointer"
                onClick={() => toggleExpand(order.order_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold">Order #{order.order_id}</p>
                      <p className="text-sm opacity-60">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <span
                      className={`badge badge-outline ${statusColors[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-bold">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </p>
                    {["pending", "confirmed"].includes(order.status) && (
                      <button
                        className="btn btn-xs btn-error btn-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelModal({
                            open: true,
                            orderId: order.order_id,
                          });
                        }}
                      >
                        <X size={12} /> Cancel
                      </button>
                    )}
                    {expandedOrder === order.order_id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Order Items */}
              {expandedOrder === order.order_id && (
                <div className="px-6 pb-4">
                  <div className="divider mt-0"></div>
                  {!orderItems[order.order_id] ? (
                    <div className="flex justify-center py-4">
                      <span className="loading loading-spinner loading-sm"></span>
                    </div>
                  ) : (
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems[order.order_id].map((item) => (
                          <tr key={item.order_item_id}>
                            <td className="font-medium">{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td className="font-semibold">
                              $
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2,
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal.open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel Order</h3>
            <p className="py-4 text-gray-500">
              Are you sure you want to cancel this order? Stock will be
              restored.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setCancelModal({ open: false, orderId: null })}
              >
                No, Keep It
              </button>
              <button
                className="btn btn-error btn-outline"
                onClick={handleCancel}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setCancelModal({ open: false, orderId: null })}
          />
        </div>
      )}
    </div>
  );
}
