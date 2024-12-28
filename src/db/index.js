import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDataBase = async () => {
    try {
        let uri = `${process.env.MONGODB_URI}/${DB_NAME}`;  
        const connectionInstance = await mongoose.connect(uri);        
    } catch (error) {
        console.log("MongoDB Connection failed");
        console.log(error);
        process.exit(1);
    }
}

export {
    connectDataBase
};