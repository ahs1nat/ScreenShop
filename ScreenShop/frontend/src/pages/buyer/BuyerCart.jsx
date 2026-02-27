import { useEffect, useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BuyerCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, itemId: null });
  const navigate = useNavigate();

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { headers: authHeader });
      const data = await res.json();
      if (data.success) setCartItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const res = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    if (res.ok) fetchCart();
  };

  const handleRemove = async () => {
    const id = deleteModal.itemId;
    setDeleteModal({ open: false, itemId: null });
    const res = await fetch(`/api/cart/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (res.ok) fetchCart();
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: authHeader,
      });
      const data = await res.json();
      if (data.success) {
        fetchCart();
        navigate("/buyer/orders");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 opacity-50">
          <ShoppingBag size={48} />
          <p className="text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.cartitem_id} className="card bg-base-200 shadow">
                <div className="card-body flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <div className="avatar">
                        <div className="mask mask-squircle w-14 h-14">
                          <img src={item.image_url} alt={item.name} />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="mask mask-squircle w-14 h-14 bg-neutral text-neutral-content">
                          <span>{item.name[0]}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm opacity-60">
                        ${parseFloat(item.price).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-xs btn-circle btn-outline"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartitem_id,
                            item.quantity - 1,
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-xs btn-circle btn-outline"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartitem_id,
                            item.quantity + 1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold w-20 text-right">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className="btn btn-sm btn-circle btn-error btn-outline"
                      onClick={() =>
                        setDeleteModal({ open: true, itemId: item.cartitem_id })
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card bg-base-200 shadow h-fit">
            <div className="card-body">
              <h2 className="card-title mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="opacity-60">Items ({cartItems.length})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="opacity-60">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Remove Item</h3>
            <p className="py-4 text-gray-500">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteModal({ open: false, itemId: null })}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-outline"
                onClick={handleRemove}
              >
                Yes, Remove
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setDeleteModal({ open: false, itemId: null })}
          />
        </div>
      )}
    </div>
  );
}
