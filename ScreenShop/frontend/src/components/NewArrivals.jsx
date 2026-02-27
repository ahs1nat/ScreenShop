import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/new-arrivals")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <section className="w-full py-8">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </section>
    );

  return (
    <section className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <Link to="/products" className="btn btn-ghost btn-sm">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.product_id}`} className="no-underline">
      <div className="card bg-base-200 hover:shadow-lg hover:scale-105 transition-all duration-200 h-full">
        <figure className="h-40 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-base-300 flex items-center justify-center text-4xl">
              🛍️
            </div>
          )}
        </figure>
        <div className="card-body p-3">
          <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
          <p className="text-xs opacity-60">{product.store_name}</p>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-warning fill-warning" />
            <span className="text-xs">
              {parseFloat(product.avg_rating).toFixed(1)}
            </span>
            <span className="text-xs opacity-50">({product.review_count})</span>
          </div>
          <p className="font-bold text-primary text-sm mt-1">
            ${parseFloat(product.price).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
