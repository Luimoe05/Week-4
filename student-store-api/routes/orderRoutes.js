const express = require("express");
const router = express.Router();
const order = require("../controllers/order.js");

router.get("/", order.getAllOrders);
router.get("/:id", order.getOrderById);
router.post("/", order.createOrder);
router.put("/:id", order.updateOrder);
router.delete("/:id", order.deleteOrder);

//this is to get the total for the order
router.get("/:order_id/total", order.calculateOrderTotal);

module.exports = router;
