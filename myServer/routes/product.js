const express = require("express");
const router = express.Router();
const ProductModel = require("../models/product");
const server = express();

server.use(express.json()); 

router.get("/", (req, res) => {
    ProductModel.find()
      .then(data => res.send(data))
      .catch(err => res.status(500).send("Sorry, can't retrieve data"));
  });
  
  
  router.get("/getProductById/:id", function (req, res) {
    var prodId = +req.params.id;
    ProductModel.find({ id: prodId })
      .then((product) => {
        if (product) {
          res.send(product);
        } else {
          res.send("cant find product with this id!");
        }
      })
      .catch((err) => {
        res.send("Error retrive Data");
      });
  });
  
 
  router.post("/createProduct", (req, res) => {
    const newProduct = new ProductModel(req.body);
  
    newProduct.save() 
      .then(() => res.status(201).send("Product created successfully")) 
      .catch(err => {
        console.error("Error creating product:", err); 
        res.status(400).send("Error creating product"); 
      });
  });

  router.get("/getProductByName", (req, res) => {
    const { name } = req.query; 
    
    if (!name) {
      return res.status(400).send("Missing name query parameter");
    }
  
    ProductModel.find({ title: { $regex: name, $options: 'i' } }) 
      .then(products => res.send(products))
      .catch(err => {
        console.error("Error retrieving products:", err); 
        res.status(500).send("Error retrieving products");
      });
  });
  
  router.delete('/deleteProduct/:id', function (req, res) {
    var prodId = +req.params.id;
    ProductModel.deleteOne({ id: prodId })
        .then((result) => {
            res.json({ message: "Deleted successfully" });
        })
        .catch((err) => {
            res.status(500).json({ error: "Error deleting product with this id" });
        });
  });
  
  router.put("/updateProduct/:id", (req, res) => {
    const prodId = +req.params.id; 
    ProductModel.findOneAndUpdate({ id: prodId }, req.body, { new: true }) 
      .then(updatedProduct => {
        if (updatedProduct) {
          res.send(updatedProduct); 
        } else {
          res.status(404).send("Product not found"); 
        }
      })
      .catch(err => {
        console.error("Error updating product:", err); 
        res.status(500).send("Error updating product"); 
      });
  });
  
  module.exports = router;
  