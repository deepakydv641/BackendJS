// ✅ dotenv MUST be the first import
import dotenv from "dotenv";
dotenv.config({ path: './.env' });  // Load env before anything else

import ConnectDB from "./db/index.js";
import app from "./app.js";

ConnectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Errro", error)
            throw error
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log("server is running on port", process.env.PORT);
        })
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
        process.exit(1);
    })