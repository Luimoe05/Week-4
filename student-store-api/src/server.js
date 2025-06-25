require("dotenv").config();

const express = require("express");
const app = express();
const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");
const orderItemRoutes = require("../routes/orderItemRoutes");
const cors = require("cors");

const corsOption = {
  orgin: "http://localhost:5173",
};

//middleware
app.use(express.json());
app.use(cors(corsOption));
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/orderItems", orderItemRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
});
