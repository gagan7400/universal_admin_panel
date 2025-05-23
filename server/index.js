let express = require("express");
let app = express();
let path = require("path");
let cors = require("cors");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:80', 'http://localhost:5173'], // Whitelist domains
    credentials: true, // Allow cookies and credentials
}));
let connectDb = require("./db/connectDb");
let port = process.env.PORT || 4000;
let authRoute = require("./routes/authRoute");
let userRoute = require("./routes/userRoute");
let productRoute = require("./routes/productRoute");
let errorMiddleware = require("./middlewares/error");
let dotenv = require("dotenv").config({ path: path.join(__dirname, "/config/.env") });

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

connectDb(process.env.MONGOURI); // ✅ Correct


app.use(express.json()); // ✅ For JSON payloads


app.use("/api/admin", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

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