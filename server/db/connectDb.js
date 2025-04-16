const mongoose = require("mongoose");

const connectDb = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}
module.exports =connectDb ;