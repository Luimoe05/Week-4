const express = require("express");
const router = express.Router();
const orderItem = require("../controllers/orderItem");

router.get("/", orderItem.getAllOrderItems);
router.post("/:order_id", orderItem.createOrderItem);
router.delete("/:id", orderItem.deleteOrderItem); 
module.exports = router;
