import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "./NewArrivals";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/top-products")
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
        <h2 className="text-2xl font-bold">Top Products</h2>
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
