const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await mongoose.disconnect();
};

module.exports = {
    connectDB,
    disconnectDB
};