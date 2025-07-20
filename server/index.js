let express = require("express");
let app = express();
let path = require("path");
let dotenv = require("dotenv").config({ path: path.join(__dirname, "/config/.env") });
let cors = require("cors");
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "*", // Whitelist domains
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json()); // ✅ For JSON payloads
let connectDb = require("./db/connectDb");
let port = process.env.PORT || 4000;
let authRoute = require("./routes/authRoute");
let userRoute = require("./routes/userRoute");
let orderRoute = require("./routes/orderRoute");
let productRoute = require("./routes/productRoute");
let cartRoute = require("./routes/cartRoute");
let errorMiddleware = require("./middlewares/error");
1

let uploadpath = path.join(__dirname, "/uploads");
app.use("/uploads/", express.static(uploadpath))
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

connectDb(process.env.MONGOURI); // ✅ Correct

// Routes define
app.use("/api/admin", authRoute);
app.use("/api/user", userRoute);
app.use("/api/order", orderRoute);
app.use("/api/product", productRoute);
app.use('/api/cart', cartRoute);
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});