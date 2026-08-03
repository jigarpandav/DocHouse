import mongoose from 'mongoose';
import config from "./config.js"


const connectDB = async () => {
    try {
         await mongoose.connect(config.MONGO_URL);
        console.log("MongoDB Connect successfully");
    }catch(err){
        console.log("MongoDB is not connect")
        process.exit(1);
    }
}

export default connectDB;


