const express = require("express");
const app = express();

const cors = require("cors");
 
const connectDb = require("./db/connectDb");
let path = require("path");
const dotenv = require("dotenv").config({ path: path.join(__dirname, "/config/.env") });

let port = process.env.PORT || 4000;

connectDb(process.env.MONGOURI); // ✅ Correct

app.use(cors());
app.use(express.json()); // ✅ For JSON payloads

let authRoute = require("./routes/authRoute");
let userRoute = require("./routes/userRoute");

app.use("/api/admin", authRoute);
app.use("/api/user", userRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
