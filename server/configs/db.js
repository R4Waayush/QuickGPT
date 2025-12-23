import mongoose from "mongoose";

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI || process.env.MONOGBD_URI)
    .then(()=>{
        console.log("connected to data base");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
        process.exit(1);
    });
}

export default connectDB;

    