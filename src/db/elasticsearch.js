// config/initElastic.js

import client from "../utils/elasticsearch.js";

export const initElastic = async () => {
    if (!process.env.CLOUD_ID || !process.env.ELASTIC_API_KEY) {
        console.warn("⚠️  Elasticsearch credentials not set (CLOUD_ID or ELASTIC_API_KEY) — skipping Elasticsearch init");
        return;
    }

    try {
        const indexName = "videos";

        const exists = await client.indices.exists({ index: indexName });

        if (!exists) {
            await client.indices.create({
                index: indexName,
                mappings: {
                    properties: {
                        title: { type: "search_as_you_type" },
                        description: { type: "text" },
                        tags: { type: "text" },
                        creator: { type: "keyword" }
                    }
                }
            });

            console.log("✅ Elasticsearch index created");
        } else {
            console.log("ℹ️ Elasticsearch index already exists");
        }
    } catch (err) {
        console.error("❌ Elasticsearch init failed (server will still start):", err.message);
    }
};