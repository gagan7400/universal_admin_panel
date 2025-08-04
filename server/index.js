let express = require("express");
let app = express();
let path = require("path");
let dotenv = require("dotenv").config();
let cors = require("cors");
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "https://technicalceramics.in",
    "http://technicalceramics.in",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));


app.use(express.json()); // ✅ For JSON payloads
let connectDb = require("./db/connectDb");
let port = process.env.PORT || 4000;
let authRoute = require("./routes/authRoute");
let userRoute = require("./routes/userRoute");
let orderRoute = require("./routes/orderRoute");
let productRoute = require("./routes/productRoute");
let cartRoute = require("./routes/cartRoute");
let paymentRoute = require("./routes/paymentRoute");
let errorMiddleware = require("./middlewares/error");


let uploadpath = path.join(__dirname, "/uploads");
app.use("/uploads/", express.static(uploadpath))
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {

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
app.use('/api/payment', paymentRoute);
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});



