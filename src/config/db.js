const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Abdulloh:634571@cluster0.76u0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("Connected to MongoDB using Mongoose!")).catch(err => console.log("Error connecting"))
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;



