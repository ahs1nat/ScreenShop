const sellerOnly = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Only sellers are allowed to perform this action",
    });
  }
  next();
};

export default sellerOnly;