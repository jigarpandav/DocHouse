import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL is not defined in environment variable");
}

const config = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT || 3000,
}

export default config;
