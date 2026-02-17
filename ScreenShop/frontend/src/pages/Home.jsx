import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <div className="sticky top-0 z-50 bg-base-100">
        <Navbar />
      </div>
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <Hero />
          <CategorySection />
        </div>
      </div>
    </div>
  );
}
