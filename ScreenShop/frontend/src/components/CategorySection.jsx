import { Link } from "react-router-dom";

const categories = [
  { name: "Electronics", icon: "📱", link: "/products?category=electronics" },
  { name: "Toys", icon: "🧸", link: "/products?category=toys" },
  { name: "Stationery", icon: "✏️", link: "/products?category=stationery" },
  { name: "Fashion", icon: "👔", link: "/products?category=fashion" },
  { name: "Books", icon: "📚", link: "/products?category=books" },
];

export default function CategorySection() {
  return (
    <section className="w-full py-12">
      <h2 className="text-4xl font-bold mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            to={cat.link}
            key={cat.name}
            className="no-underline"
          >
            <div className="card bg-base-100 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full">
              <div className="card-body items-center text-center py-6">
                <div className="text-5xl mb-3">{cat.icon}</div>
                <h3 className="card-title text-base">{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
