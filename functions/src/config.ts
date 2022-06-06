import dotenv from "dotenv";

dotenv.config();

export default {
    env: process.env.NODE_ENV,
    coinApiUrl: process.env.COIN_API_URL,
    coinApiKey: process.env.COIN_API_KEY,
    gac: process.env.CUSTOM_GOOGLE_APPLICATION_CREDENTIALS,
};
