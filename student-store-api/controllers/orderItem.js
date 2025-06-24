const prisma = require("../model/prismaClient");

exports.getAllOrderItems = async (req, res) => {
  try {
    let orderItems = await prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });

    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const { product_id, quantity } = req.body;

    const productObject = await prisma.product.findUnique({
      where: { id: Number(product_id) },
    });

    //checks if the product exist in the other db
    if (!productObject) {
      return res.status(404).json({ error: "The product was not found" });
    }
    //this will fetch the price
    const price = productObject.price;
    console.log("The product price: ", price);

    const itemTotal = Number(price) * Number(quantity);

    const newOrderItem = await prisma.orderItem.create({
      data: {
        order_id: Number(orderId),
        product_id,
        quantity,
        price,
      },
      include: {
        order: true,
        product: true,
      },
    });

    const updateOrderPrice = await prisma.order.update({
      where: { order_id: Number(orderId) },
      data: {
        total_price: {
          increment: itemTotal,
        },
      },
    });

    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const itemToDelete = await prisma.orderItem.findUnique({
      where: { id },
    });

    if (!itemToDelete) {
      return res.status(404).json({ error: "Order item not found" });
    }

    //This will hold the item total
    const itemTotal =
      Number(itemToDelete.price) * Number(itemToDelete.quantity);

    await prisma.orderItem.delete({ where: { id } });

    //This will make sure that when the item is deleted, we subtract the price of the item from the total price
    await prisma.order.update({
      //this points to the order id of the item you want to delete
      where: { order_id: itemToDelete.order_id },
      data: {
        total_price: {
          decrement: itemTotal,
        },
      },
    });

    res.status(205).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
