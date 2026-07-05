// config/initElastic.js

import client from "../utils/elasticsearch.js";

export const initElastic = async () => {

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

        } else {
            // Index already exists
        }
    } catch (err) {
        console.log('error in initElastic:', err.message);
    }
};