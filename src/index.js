// dotenv MUST be loaded before any other imports that use process.env
// sabse phele ye index.js file run hoti hai , so that connection with the database and with the elastic search can be elstabilished.
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env")  // always resolves from the root folder where you run `npm run dev`
});

import ConnectDB from "./db/index.js";
import app from "./app.js";
import { initElastic } from "./db/elasticsearch.js";

ConnectDB()
    .then(async () => {
        try {
            await initElastic();
        } catch (err) {
            console.error("❌ Elasticsearch init failed (server will still start):", err.message);
        }
        app.on("error", (error) => {
            console.log("App error:", error)
            throw error
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log("Server is running on port", process.env.PORT || 8000);
        })
    })
    .catch((error) => {
        console.log("Error connecting to database:", error);
        process.exit(1);
    })