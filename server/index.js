const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./db/connectDb");
let path = require("path");
const portfinder = require('portfinder');
const dotenv = require("dotenv").config({ path: path.join(__dirname, "/config/.env") });
let adminAuthRoute = require("./routes/adminAuthRoute")
let userRoute = require("./routes/userRoute");
const { registration, verifyOTP } = require("./controllers/userController");
app.use(cors());
let port = process.env.PORT || 4000
connectDb(process.env.MONGOURI)

app.use(express.json());

app.use("/api/user", userRoute)
app.use("/api/admin", adminAuthRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
