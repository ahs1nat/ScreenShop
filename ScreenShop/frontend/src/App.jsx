import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<div className="min-h-screen flex items-center justify-center"><div className="card bg-base-100 shadow-xl p-8"><h1 className="text-3xl font-bold">Products Page</h1></div></div>} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><div className="card bg-base-100 shadow-xl p-8"><h1 className="text-3xl font-bold">About Us</h1></div></div>} />
        <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><div className="card bg-base-100 shadow-xl p-8"><h1 className="text-3xl font-bold">Contact Us</h1></div></div>} />
        <Route path="/signup" element={<div className="min-h-screen flex items-center justify-center"><div className="card bg-base-100 shadow-xl p-8"><h1 className="text-3xl font-bold">Sign Up</h1></div></div>} />
      </Routes>
    </BrowserRouter>
  );
}
