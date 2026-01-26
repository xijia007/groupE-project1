import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import auth_routers from "./routers/auth_routers.js";
import product_routers from "./routers/product_routers.js";
import cart_routers from "./routers/cart_routers.js";
import config from "./config.js";
import db from "./routers/database.js";

const port = config.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ success: true, data: "ok" });
});

app.use("/api/auth", auth_routers);
app.use("/api/products", product_routers);
app.use("/api/cart", cart_routers);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
