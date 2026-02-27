import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import NewArrivals from "../components/NewArrivals";
import TopProducts from "../components/TopProducts";
import TopSellers from "../components/TopSellers";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <div className="sticky top-0 z-50 bg-base-100">
        <Navbar />
      </div>
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <Hero />
          <CategorySection />
          <NewArrivals />
          <TopProducts />
          <TopSellers />
        </div>
      </div>
    </div>
  );
}
