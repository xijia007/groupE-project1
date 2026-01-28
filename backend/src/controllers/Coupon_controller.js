import db from "../routers/database.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;
    const newCoupon = await db.collection("Coupon").insertOne({
      code,
      discountPercentage,
      expirationDate: new Date(expirationDate),
    });
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: "Error creating coupon", error });
  }
};

export const verifyCoupon = async (req, res) => {
  try {
    const { code } = req.query;
    const coupon = await db.collection("Coupon").findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    const exp = new Date(coupon.expirationDate);
    const currentDate = new Date();
    if (exp < currentDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    res
      .status(200)
      .json({ valid: true, discountPercentage: coupon.discountPercentage });
  } catch (error) {
    res.status(500).json({ message: "Error verifying coupon", error });
  }
};
