require('dotenv').config() // to access variable of .env file
const express = require("express")
const cors = require("cors")
const connectToDatabase = require("./src/database/db")
const app = express()
const authRoutes = require("./src/routes/auth")
const productRoutes = require("./src/routes/productRoutes") // <-- Add this line


//middlewares
app.use(cors({
  origin : ["http://localhost:5174", "https://blogpost-nine-flax.vercel.app"]
}))
app.use(express.json())

//Database connection
connectToDatabase()

// ⬇️ Routes should be registered BEFORE starting the server
//user login register garne route
app.use("/api/auth", authRoutes)

//Product add garne route
app.use("/api/products", productRoutes);

//For static files
app.use(express.static('./uploads'))

app.listen(process.env.PORT, ()=>{  //.env file bata PORT var access gareko
    console.log("Node JS project has started")
}) 

