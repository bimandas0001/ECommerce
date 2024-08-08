import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect with Mongodb atlas.
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_URL);
        console.log("Database connected");
    } 
    catch (error) {
        console.error("Error (database connection) : " + error);
    }
}

// Disconnect from database
async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
        console.log("Successfully disconnected from the database");
    } 
    catch (error) {
        console.error("Error (disconnecting database) : " + error);
    }
}

export {connectToDatabase, disconnectFromDatabase};
