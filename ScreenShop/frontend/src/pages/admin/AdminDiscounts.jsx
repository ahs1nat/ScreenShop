// src/pages/admin/Discounts.jsx
import React from "react";

export default function Discounts() {
  return (
    <div className="min-h-screen p-8 bg-base-100">
      <h1 className="text-3xl font-bold mb-6">Admin Discounts</h1>
      <p className="text-gray-600">
        This is a placeholder for managing discounts. You can add discount CRUD
        functionality here.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-white shadow p-4 rounded-lg">
          <h2 className="font-semibold text-lg">Discount 1</h2>
          <p>Details about this discount will appear here.</p>
        </div>
        <div className="card bg-white shadow p-4 rounded-lg">
          <h2 className="font-semibold text-lg">Discount 2</h2>
          <p>Details about this discount will appear here.</p>
        </div>
        <div className="card bg-white shadow p-4 rounded-lg">
          <h2 className="font-semibold text-lg">Discount 3</h2>
          <p>Details about this discount will appear here.</p>
        </div>
      </div>
    </div>
  );
}
