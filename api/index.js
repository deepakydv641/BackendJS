// Vercel serverless entry point
// dotenv must be loaded first
import dotenv from "dotenv";
dotenv.config();

import ConnectDB from "../src/db/index.js";
import { initElastic } from "../src/db/elasticsearch.js";
import app from "../src/app.js";

// Connect DB and init Elasticsearch on cold start
await ConnectDB();
await initElastic();

// Export app — Vercel calls this as a serverless function
export default app;
