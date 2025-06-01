import mongoose from "mongoose";
import { config } from "./app.config";
import logger from "../utils/logger";

const connectDatabase = async () =>{
    try {
        await mongoose.connect(config.MONGO_URI);
        logger.info("MongoDB connected successfully.")
    } catch (error) {
        logger.error("Error connect to MongoDB.",error);
        process.exit(1);
    }
}
export default connectDatabase;