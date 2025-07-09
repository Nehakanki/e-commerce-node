const express = require('express');
const app = express();
const cors = require('cors');
const { appendFile } = require('fs');
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
require("dotenv").config();

const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderProductRoutes = require('./routes/orderRoute')


db.connect();
const PORT = process.env.PORT || 5000;

// ------Logger Middleware ---------------
// app.use((req,res,next) =>{
//     req.time = new Date(Date.now()).toString();
//     // console.log(req.method,req.hostname, req.path, req.time);
//     const logEntry = `${req.method} ${req.hostname} ${req.path} ${req.time}\n`;
//     appendFile('Logs.txt', logEntry, (err) => {
//       if (err) {
//         console.error('Error writing to file:', err);
//       }
//     });
//     next();
//   });

  const logStream = fs.createWriteStream(path.join(__dirname, "Logs.txt"), { flags: "a" });
  app.use(morgan("combined", { stream: logStream }));
// Default route to check API is running
app.get("/",(req, res) => {
    res.send("API is running...");
});

// Register auth routes
app.use('/api/auth', authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/order',orderProductRoutes)

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
