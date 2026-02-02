import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    PORT: process.env.PORT || 3001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_Acess_Secret: process.env.JWT_ACCESS_SECRET,
    JWT_Refresh_Secret: process.env.JWT_REFRESH_SECRET,
}

export default config;
