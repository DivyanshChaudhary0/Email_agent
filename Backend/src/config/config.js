
import {config} from "dotenv"
config();

const _config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_GEMINI_KEY: process.env.GOOGLE_GEMINI_KEY
}

export default Object.freeze(_config);