import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Plus, Minus, Store } from "lucide-react";
import Navbar from "../components/Navbar";

export default function IndividualProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "buyer") {
      showToast("Only buyers can add to cart", "error");
      return;
    }
    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.product_id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Added to cart successfully!");
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-xl opacity-50">Product not found.</p>
        </div>
      </div>
    );

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left — Image */}
          <div className="rounded-2xl overflow-hidden bg-base-200 h-96 lg:h-auto">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🛍️
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="flex flex-col gap-4">
            <span className="badge badge-outline badge-primary w-fit">
              {product.category_name}
            </span>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {stars.map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(product.avg_rating)
                        ? "text-warning fill-warning"
                        : "text-base-300 fill-base-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {parseFloat(product.avg_rating).toFixed(1)}
              </span>
              <span className="text-sm opacity-50">
                ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-4xl font-bold text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </p>

            {/* Store */}
            <div className="flex items-center gap-2 opacity-70">
              <Store size={16} />
              <span className="text-sm">
                Sold by{" "}
                <span className="font-medium">{product.store_name}</span>
              </span>
            </div>

            {/* Stock */}
            <div>
              {product.quantity > 0 ? (
                <span className="badge badge-success badge-outline">
                  In Stock ({product.quantity} available)
                </span>
              ) : (
                <span className="badge badge-error badge-outline">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="divider my-1"></div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-sm btn-circle btn-outline"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-lg">
                  {quantity}
                </span>
                <button
                  className="btn btn-sm btn-circle btn-outline"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.quantity, q + 1))
                  }
                  disabled={quantity >= product.quantity}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                className="btn btn-primary flex-1"
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity === 0}
              >
                {addingToCart ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card bg-base-200 shadow mb-8">
          <div className="card-body">
            <h2 className="card-title">Product Description</h2>
            <p className="opacity-70 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="card bg-base-200 shadow mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">Ratings & Reviews</h2>
            {product.reviews.length === 0 ? (
              <div className="alert alert-info">
                <span>
                  No reviews yet. Be the first to review this product!
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {product.reviews.map((review) => (
                  <div
                    key={review.review_id}
                    className="border-b border-base-300 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{review.buyer_name}</p>
                      <div className="flex">
                        {stars.map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? "text-warning fill-warning"
                                : "text-base-300 fill-base-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm opacity-70">{review.review_text}</p>
                    <p className="text-xs opacity-40 mt-1">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Questions & Answers</h2>
            {product.questions.length === 0 ? (
              <div className="alert alert-info">
                <span>
                  No questions yet. Ask the seller anything about this product!
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {product.questions.map((q) => (
                  <div
                    key={q.question_id}
                    className="border-b border-base-300 pb-4 last:border-0"
                  >
                    <div className="flex gap-2 mb-1">
                      <span className="badge badge-primary badge-sm">Q</span>
                      <p className="text-sm font-medium">{q.question_text}</p>
                    </div>
                    <p className="text-xs opacity-50 mb-2 ml-6">
                      Asked by {q.buyer_name}
                    </p>
                    {q.answer_text ? (
                      <div className="flex gap-2 ml-6">
                        <span className="badge badge-success badge-sm">A</span>
                        <p className="text-sm opacity-70">{q.answer_text}</p>
                      </div>
                    ) : (
                      <p className="text-xs opacity-40 ml-6 italic">
                        No answer yet
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-end z-[200]">
          <div
            className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"}`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
