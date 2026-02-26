import { useState } from "react";
import axios from "axios";

export default function SellerRegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    storeName: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "seller",
        store_name: formData.storeName,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-backdrop" onClick={onClose}></div>

      <div
        className="modal-box relative p-8 max-w-md rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Seller Registration</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="input input-bordered w-full  pl-2 border border-gray-300 border-base-300"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="storeName"
                placeholder="Store Name"
                className="input input-bordered w-full pl-2 border border-gray-300 border-base-300"
                value={formData.storeName}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
              >
                Submit for Approval
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <svg
              className="w-16 h-16 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>

            <h3 className="text-xl font-semibold text-green-600 text-center">
              Seller registration form submitted for approval
            </h3>

            <button onClick={onClose} className="btn btn-primary mt-6">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
