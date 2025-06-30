import Product from "../../models/Product";

router.get("/recommend/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({ recommended: related });
  } catch (err) {
    res.status(500).json({ error: "Recommendation fetch failed" });
  }
});
