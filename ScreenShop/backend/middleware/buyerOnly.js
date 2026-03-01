const buyerOnly = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({
      success: false,
      message: "Only buyers are allowed to perform this action",
    });
  }
  next();
};

export default buyerOnly;