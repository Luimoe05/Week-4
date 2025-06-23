//HERE I WILL CREATE CRUD METHODS

//importing the prisma
const prisma = require("../model/prismaClient");

/*
Get the data
this will run when the path is GET /products 
*/

exports.getAll = async (req, res) => {
  //THIS FETCHES ALL OF THE PRODUCTS IN THE DB
  let products = await prisma.product.findMany();

  const { category, name, maxPrice } = req.query;
  // if the category option is inputed
  if (category) {
    products = products.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (name) {
    products = products.filter((p) =>
      p.category.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (maxPrice) {
    products = products.filter((p) => p.price <= Number(maxPrice));
  }

  res.json(products);
};

/*
update the data at id
This will run when the path is GET /products/:id
*/
exports.getById = async (req, res) => {
  const id = Number(req.params.id); //get the id from the params

  try {
    const oneProduct = await prisma.product.findUnique({ where: { id } });
    if (!oneProduct) {
      //returns not found and 404 if the product const is empty
      return res.status(404).json({ error: "Not found" });
    } else {
      //returns the product if the if condition above is false
      res.json(oneProduct);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
create the data
this will run when POST /products
*/
exports.create = async (req, res) => {
  const { name, price, image_url, category } = req.body;
  const newProduct = await prisma.product.create({
    data: { name, price, image_url, category },
  });

  res.status(201).json(newProduct);
};

/* 
here since its a update we do POST /products/:id
*/
exports.update = async (req, res) => {
  const id = Number(req.params.id); //this will store the id inside of the const id
  const { name, price, image_url, category, description } = req.body; //this will store the data passed
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, price, image_url, category, description },
  });

  res.status(204).json(updatedProduct);
};

/*
Here will go the remove, so it will be DELETE /products/:id
*/
exports.remove = async (req, res) => {
  const id = Number(req.params.id); //this will store the id inside of the const id
  await prisma.product.delete({ where: { id } });
  res.status(204).end();
};
