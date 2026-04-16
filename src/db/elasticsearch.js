// config/initElastic.js

import client from "../utils/elasticsearch.js";

export const initElastic = async () => {
    const indexName = "videos";

    const exists = await client.indices.exists({ index: indexName });

    if (!exists) {
        await client.indices.create({
            index: indexName,
            mappings: {
                properties: {
                    title: { type: "text" },
                    description: { type: "text" },
                    tags: { type: "text" },
                    creator: { type: "keyword" }
                }
            }
        });

        console.log("✅ Elasticsearch index created");
    } else {
        console.log("ℹ️ Index already exists");
    }
};