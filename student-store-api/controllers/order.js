//importing the prisma
const prisma = require("../model/prismaClient");

/* 
Here I have to create methods for creating, fetching, updating, and deleting orders
*/

//GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  //This will give you all of the orders in the DB
  let orders = await prisma.order.findMany();
  res.json(orders);
};

//GET ORDERS BY ID
exports.getOrderById = async (req, res) => {
  const order_id = Number(req.params.order_id);
  try {
    const oneOrder = await prisma.order.findUnique({
      where: { order_id },
    });

    //if the product does not exist
    if (!oneOrder) return res.status(404).json({ error: "Not Found" });
    //if the product does exist then you return its json info
    else res.json(oneOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//CREATE AN ORDER
exports.createOrder = async (req, res) => {
  const { customer_id, total_price, status } = req.body;
  const newOrder = await prisma.order.create({
    data: { customer_id, total_price, status },
  });

  //This returns the correct status and the new order json
  res.status(201).json(newOrder);
};

//UPDATE AN ORDER
exports.updateOrder = async (req, res) => {
  const order_id = Number(req.params.order_id);
  const { customer_id, total_price, status } = req.body;
  const updatedOrder = await prisma.order.update({
    where: { order_id },
    data: { customer_id, total_price, status },
  });
  res.status(200).json(updatedOrder);
};

//DELETE AN ORDER
exports.deleteOrder = async (req, res) => {
  const order_id = Number(req.params.order_id);
  await prisma.order.delete({ where: { order_id } });
  res.status(204).end();
};

//THIS WILL CALCULATE THE TOTAL PRICE OF THE ORDER
//IT WILL BE A /GET
exports.calculateOrderTotal = async (req, res) => {
  const id = req.params.order_id;

  try {
    const order = await prisma.order.findUnique({
      where: { order_id: Number(id) },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    //check if the order does not exist
    if (!order) {
      //this will return an error if the order is not found in the DB
      return res.status(404).json({ error: "The order was not found" });
    }

    let calculatedTotal = 0;
    const itemDetails = [];

    order.orderItems.forEach((item) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      calculatedTotal += itemTotal;

      itemDetails.push({
        product_name: item.product.name,
        quantity: item.quantity,
        price_per_unit: parseFloat(item.price),
        //toFixed here will round the decimal to 2 points
        item_total: itemTotal.toFixed(2),
      });
    });
    res.json({
      order_id: order.order_id,
      customer_id: order.customer_id,
      status: order.status,
      calculatedTotal: calculatedTotal.toFixed(2),
      stored_total: parseFloat(order.total_price).toFixed(2),
      item: itemDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
