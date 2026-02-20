// backend/controllers/adminController.js

// Minimal placeholder functions for admin routes
// These just return empty arrays or success messages
// so your frontend can fetch data without backend errors

export const getAllStores = async (req, res) => {
  res.json({ success: true, stores: [] });
};

export const deleteStore = async (req, res) => {
  res.json({ success: true, message: "deleteStore placeholder executed" });
};

export const getAllProducts = async (req, res) => {
  res.json({ success: true, products: [] });
};

export const deleteProduct = async (req, res) => {
  res.json({ success: true, message: "deleteProduct placeholder executed" });
};

export const getCategories = async (req, res) => {
  res.json({ success: true, categories: [] });
};

export const addCategory = async (req, res) => {
  res.json({ success: true, message: "addCategory placeholder executed" });
};

export const editCategory = async (req, res) => {
  res.json({ success: true, message: "editCategory placeholder executed" });
};

export const deleteCategory = async (req, res) => {
  res.json({ success: true, message: "deleteCategory placeholder executed" });
};

export const getDiscounts = async (req, res) => {
  res.json({ success: true, discounts: [] });
};

export const addDiscount = async (req, res) => {
  res.json({ success: true, message: "addDiscount placeholder executed" });
};

export const editDiscount = async (req, res) => {
  res.json({ success: true, message: "editDiscount placeholder executed" });
};

export const deleteDiscount = async (req, res) => {
  res.json({ success: true, message: "deleteDiscount placeholder executed" });
};
