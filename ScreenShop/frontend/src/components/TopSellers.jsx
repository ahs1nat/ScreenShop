import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";

export default function TopSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/top-sellers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSellers(data.data);
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
      <h2 className="text-2xl font-bold mb-6">Top Sellers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sellers.map((seller) => (
          <Link
            key={seller.seller_id}
            to={`/seller/${seller.seller_id}/store`}
            className="no-underline"
          >
            <div className="card bg-base-200 hover:shadow-lg hover:scale-105 transition-all duration-200">
              <div className="card-body items-center text-center py-6 gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-14">
                    <span className="text-xl">{seller.store_name[0]}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm">{seller.store_name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star size={12} className="text-warning fill-warning" />
                    <span className="text-xs">
                      {parseFloat(seller.avg_rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ShoppingBag size={12} className="opacity-50" />
                    <span className="text-xs opacity-50">
                      {seller.total_sales} sold
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
