import { Link } from "react-router-dom";
import { useState } from "react";
import SellerRegistrationModal from "./sellerRegistrationModal.jsx";

export default function Hero() {
  const [isSellerModalOpen, setSellerModalOpen] = useState(false);
  return (
    <section
      className="hero h-96 rounded-lg shadow-lg bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/images/hero3.jpeg')`,
      }}
    >
      <div className="hero-content text-left text-white relative z-10 w-full justify-start pl-8">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-blue-950">
            Everything you need,
            <br />
            all in one place
          </h1>
          <p className="mb-5 text-lg text-blue-950">
            Discover premium products from trusted sellers. Fast delivery, best
            prices, and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="btn btn-primary text-white">
              Shop Now
            </Link>
            <button
              onClick={() => setSellerModalOpen(true)}
              className="!btn !btn-neutral btn-outline"
            >
              Become a Seller
            </button>
          </div>
        </div>
      </div>
      <SellerRegistrationModal
        isOpen={isSellerModalOpen}
        onClose={() => setSellerModalOpen(false)}
      />
    </section>
  );
}
