// dotenv MUST be loaded before any other imports that use process.env
// sabse phele ye index.js file run hoti hai , so that connection with the database and with the elastic search can be elstabilished.
import dotenv from "dotenv";
import path from "path";
import dns from "dns";

dotenv.config();

import ConnectDB from "./db/index.js";
import app from "./app.js";
import { initElastic } from "./db/elasticsearch.js";

dns.setDefaultResultOrder('ipv4first');

ConnectDB()
    .then(async () => {
        try {
            await initElastic();
        } catch (err) {
            console.log('error in initElastic:', err.message);
        }
        app.on("error", (error) => {
            console.log('error in app:', error.message)
            throw error
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log('Server is running on port', process.env.PORT || 8000);
        })
    })
    .catch((error) => {
        console.log('error in ConnectDB:', error.message);
        process.exit(1);
    })