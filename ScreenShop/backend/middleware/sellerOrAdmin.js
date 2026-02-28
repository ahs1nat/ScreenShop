const sellerOrAdmin = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Sellers and admins only.",
    });
  }
  next();
};

export default sellerOrAdmin;