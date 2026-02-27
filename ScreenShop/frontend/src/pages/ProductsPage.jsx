import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.product_id}`} className="no-underline">
      <div className="card bg-base-200 hover:shadow-lg hover:scale-105 transition-all duration-200 h-full">
        <figure className="h-48 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-base-300 flex items-center justify-center text-5xl">
              🛍️
            </div>
          )}
        </figure>
        <div className="card-body p-4">
          <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
          <p className="text-xs opacity-60">{product.store_name}</p>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-warning fill-warning" />
            <span className="text-xs">
              {parseFloat(product.avg_rating).toFixed(1)}
            </span>
            <span className="text-xs opacity-50">({product.review_count})</span>
          </div>
          <p className="font-bold text-primary mt-1">
            ${parseFloat(product.price).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}

const LIMIT = 20;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observerRef = useRef(null);
  const isFetching = useRef(false);

  const sort = searchParams.get("sort") || "new";
  const category = searchParams.get("category") || "";

  const fetchProducts = useCallback(
    async (reset = false) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setLoading(true);

      const currentOffset = reset ? 0 : offset;

      try {
        const params = new URLSearchParams();
        if (sort) params.set("sort", sort);
        if (category) params.set("category", category);
        params.set("limit", LIMIT);
        params.set("offset", currentOffset);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setProducts((prev) => (reset ? data.data : [...prev, ...data.data]));
          setHasMore(data.data.length === LIMIT);
          setOffset(currentOffset + data.data.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [sort, category, offset],
  );

  // Reset and refetch when filters change
  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    isFetching.current = false;
    fetchProducts(true);
  }, [sort, category]);

  // Fetch categories for dropdown
  useEffect(() => {
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          fetchProducts(false);
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, fetchProducts]);

  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    setSearchParams(params);
  };

  const handleCategory = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("category", value);
    else params.delete("category");
    setSearchParams(params);
  };

  const sortOptions = [
    { value: "new", label: "Newest" },
    { value: "top", label: "Top Selling" },
    { value: "rating", label: "Top Rated" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "All Products"}
            <span className="text-sm font-normal opacity-50 ml-2">
              ({products.length} shown)
            </span>
          </h1>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-base-200 rounded-2xl">
          <SlidersHorizontal size={18} className="opacity-50" />

          {/* Category Dropdown */}
          <select
            className="select select-bordered select-sm"
            value={category}
            onChange={(e) => handleCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.name.toLowerCase()}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            className="select select-bordered select-sm"
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Active category badge */}
          {category && (
            <button
              className="badge badge-primary badge-outline gap-1 cursor-pointer"
              onClick={() => handleCategory("")}
            >
              {category} ✕
            </button>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50 gap-4">
            <span className="text-5xl">🔍</span>
            <p className="text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div
          ref={observerRef}
          className="h-10 mt-6 flex justify-center items-center"
        >
          {loading && (
            <span className="loading loading-spinner loading-md text-primary"></span>
          )}
          {!hasMore && products.length > 0 && (
            <p className="text-sm opacity-40">You've seen all products</p>
          )}
        </div>
      </div>
    </div>
  );
}
