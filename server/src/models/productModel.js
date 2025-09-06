const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  category: { 
    type: String, 
    required: true, 
    enum: ["vegetables", "fruits", "grains", "dairy", "others"] 
},
  price: { 
    type: Number, 
    required: true 
},
  quantity: { 
    type: Number, 
    required: true 
},
  description: String,
  imageUrl: String ,
}, 
{ 
    timestamps: true 
});

module.exports =  mongoose.model("Product", productSchema);