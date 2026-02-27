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
    <section className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Link to={cat.link} key={cat.name} className="no-underline">
            <div className="flex items-center gap-2 px-5 py-3 bg-base-200 hover:bg-primary hover:text-primary-content rounded-full shadow-sm transition-all duration-200 cursor-pointer">
              <span className="text-xl">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
