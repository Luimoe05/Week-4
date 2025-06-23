const express = require("express");
const router = express.Router();
const product = require("../controllers/product.js");

router.get("/", product.getAll);
router.get("/:id", product.getById);
router.post("/", product.create);
router.put("/:id", product.update);
router.delete("/:id", product.remove);

module.exports = router;
