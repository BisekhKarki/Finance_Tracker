const NotFoundMiddleWare = async (req, res) => {
  return res.status(404).json({ message: "Route does not exists" });
};
