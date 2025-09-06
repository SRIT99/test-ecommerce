const express = require ("express");
const Product = require("../models/productModel.js");
const{multer,storage} = require('../middlewares/multerConfig.js')
const upload  = multer({storage: storage})

const router = express.Router();

// ➕ Add a new product
router.post("/", upload.single("image"), async (req, res) => {
  
    const { name, category, price, quantity, description} = req.body;
    let filename;
    if(req.file){
         filename = req.file.filename
    }else{
        filename = "360_F_49048277_wPiyixR71cL1GGnWMaKIX0PzC3hxPImB.jpg"
    }
    if (!name || !category || !price || !quantity || !description) {
        return res.status(400).json({
            message : "Please enter data"
        })
    }
    await Product.create({
        name, 
        category, 
        price, 
        quantity, 
        description,
        imageUrl : filename
    })
    Product.create()
    res.status(200).json({
        message : "Product created successfully"
    })
});


// 📋 Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error" });
  }
});


// 📌 Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error" });
  }
});

module.exports = router;