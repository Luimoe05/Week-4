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
  const id = Number(req.params.id);
  const oneOrder = await prisma.order.findUnique({ where: { id } });

  //if the product does not exist
  if (!oneOrder) return res.status(404).json({ error: "Not Found" });
  //if the product does exist then you return its json info
  else res.json(oneOrder);
};

//CREATE AN ORDER
exports.createOrder = async (req, res) => {
  const { customer, total, status } = req.body;
  const newOrder = await prisma.order.create({
    data: { customer, total, status },
  });

  //This returns the correct status and the new order json
  res.status(201).json(newOrder);
};

//UPDATE AN ORDER
exports.updateOrder = async (req, res) => {
  const id = Number(req.params.id);
  const { customer, total, status } = req.body;
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { customer, total, status },
  });
  res.status(204).json(updatedOrder);
};

exports.deleteOrder = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.order.delete({ where: { id } });
  res.status(204).end();
};
