const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Задаем uri из переменной окружения или используем значение по умолчанию
    const uri = process.env.MONGO_URI || "mongodb+srv://admin:admin@cluster0.z8xfi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Подключаемся к MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB using Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Завершаем процесс в случае ошибки
  }
};

module.exports = connectDB;
