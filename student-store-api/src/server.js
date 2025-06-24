require("dotenv").config();

const express = require("express");
const app = express();
const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");
const orderItemRoutes = require("../routes/orderItemRoutes");

app.use(express.json());
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/orderItems", orderItemRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
});
