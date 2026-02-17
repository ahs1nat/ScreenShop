import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section 
      className="hero h-96 rounded-lg shadow-lg bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/images/hero2.jpeg')`,
      }}
    >
      <div className="hero-content text-left text-white relative z-10 w-full justify-start pl-8">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-black">
            Everything you need,<br />all in one place
          </h1>
          <p className="mb-5 text-lg text-black">
            Discover premium products from trusted sellers. Fast delivery, best prices, and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="btn btn-primary text-white"
            >
              Shop Now
            </Link>
            <Link
              to="/signup?role=seller"
              className="btn btn-outline text-black bg-slate-200 border-black hover:bg-black hover:text-white"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
